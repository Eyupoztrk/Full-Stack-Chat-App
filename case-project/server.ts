import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import Message from './models/message';
import connectDb from './lib/db';
import {SocketWithAuth, JwtUserPayload, SendMessagePayload} from '@/types/index';


const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname: dev ? hostname : undefined, port });
const handle = app.getRequestHandler();

const onlineUsers = new Map<string, { name: string }>();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Hata', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });


  const io = new Server(httpServer, {
    cors: {
      origin: dev 
        ? ["http://localhost:3000/"] 
        : [process.env.NEXT_PUBLIC_APP_URL  || "" ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.use((socket: SocketWithAuth, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) throw new Error('Authentication error: No cookies found.');

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.token;
      if (!token) throw new Error('Authentication error: Token not found.');

      const decodedPayload = jwt.verify(token, process.env.AUTH_SECRET!) as JwtUserPayload;

      socket.user = {
        userId: decodedPayload.userId,
        email: decodedPayload.email,
        name: decodedPayload.name,
      };
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token.'));
    }
  });

  io.on('connection', (socket: SocketWithAuth) => {
    if (!socket.user) {
      return socket.disconnect();
    }

    console.log(`Yeni bir kullanıcı bağlandı: ${socket.user.name} (${socket.id})`);

    onlineUsers.set(socket.user.userId, { name: socket.user.name });
    io.emit('online_users_update', Array.from(onlineUsers.values()));

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`Kullanıcı ${socket.user?.name}, ${roomId} odasına katıldı.`);
    });

    socket.on('send_message', async (data: SendMessagePayload) => {
      if (!data.roomId || !data.content || !socket.user) return;

      try {
        await connectDb();
        const newMessage = new Message({
          content: data.content,
          roomId: data.roomId,
          senderId: socket.user.userId,
        });
        await newMessage.save();

        const populatedMessage = await newMessage.populate('senderId', 'name');
        io.to(data.roomId).emit('message_created', populatedMessage);

      } catch (error) {
        console.error('Mesaj gönderilirken hata oluştu:', error);
      }
    });

    socket.on('typing_start', (data: { roomId: string }) => {
      if (!socket.user || !data.roomId) return;

      // gönderen hariç diğer kullanıcılara gönderiyor
      socket.broadcast.to(data.roomId).emit('user_typing_start', {
        name: socket.user.name,
        userId: socket.user.userId,
      });

    });

    socket.on('typing_stop', (data: { roomId: string }) => {
      if (!socket.user || !data.roomId) return;

      socket.broadcast.to(data.roomId).emit('user_typing_stop', {
        userId: socket.user.userId,
      });
    });

    socket.on('disconnect', () => {
      if (socket.user) {
        // hata var socket.user tanımsız-- sonra bak
        onlineUsers.delete(socket.user.userId);
        io.emit('online_users_update', Array.from(onlineUsers.values()));
        console.log(`Kullanıcı ${socket.user.name} ayrıldı. Online kullanıcı sayısı: ${onlineUsers.size}`);
      }
    });
  });

   httpServer
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Environment: ${process.env.NODE_ENV}`);
    })
    .on('error', (err) => {
      console.error(err);
    });
});