'use client';

import { Message, UserPayload } from '@/types';
import { Socket } from 'socket.io-client';

interface MessageItemProps {
  message: Message;
  currentUser: UserPayload | null;
  socket: Socket | null;
}

export default function MessageItem({ message, currentUser, socket  }: MessageItemProps) {
  const isCurrentUser = message.senderId._id === currentUser?.userId;

  return (
    <div
      className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-lg ${isCurrentUser
            ? 'bg-blue-500 text-white'
            : 'bg-white dark:bg-gray-700'
          }`}
      >
        {!isCurrentUser && (
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            {message.senderId.name}
          </p>
        )}
        <p>{message.content}</p>
      </div>
    </div>
  );
}