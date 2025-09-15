import { Socket } from 'socket.io';

//sunucu mesajları için
export interface Message {
  _id: string;
  content: string;
  senderId: {
    _id: string;
    name: string;
  };
  roomId: string;
  createdAt: string;
}

// giriş yapan kullanıcı bilgileri
export interface UserPayload {
  userId: string;
  name: string;
  email: string;
}


export interface SocketWithAuth extends Socket {
  user?: {
    userId: string;
    email: string;
    name: string;
  };
}

export interface JwtUserPayload {
  userId: string;
  email: string;
  name: string;
}

export interface SendMessagePayload {
  roomId: string;
  content: string;
}


export interface UserPayload {
  userId: string;
  name: string;
  email: string;
}

export interface Room {
  _id: string;
  name: string;
}

