'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { Message, UserPayload } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DateSeparator from '@/components/chat/DateSeparator';
import MessageItem from '@/components/chat/MessageItem';
import RoomPageSkeleton from '@/components/skeletons/RoomPageSkeleton';

export default function RoomPage() {
    const params = useParams();
    const roomId = params.roomId as string;

    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState<UserPayload | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [isInitialLoading, setIsInitialLoading] = useState(true);




    const loadMoreMessages = useCallback(async () => {
        if (!hasMoreMessages || isLoadingMore || !nextCursor) return;

        setIsLoadingMore(true);
        try {
            const response = await fetch(`/api/rooms/${roomId}/messages?cursor=${nextCursor}`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('No more messages');

            const data = await response.json();

            const newMessages = data.items ? data.items.reverse() : [];
            setMessages((prevMessages) => [...newMessages, ...prevMessages]);
            setNextCursor(data.nextCursor);
            setHasMoreMessages(data.nextCursor !== null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [hasMoreMessages, isLoadingMore, nextCursor, roomId]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!roomId) return;
            setIsInitialLoading(true);
            try {
                const response = await fetch(`/api/rooms/${roomId}/messages`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'No messages');
                }

                const data = await response.json();
                setMessages(data.items ? data.items.reverse() : []);

                setNextCursor(data.nextCursor);
                setHasMoreMessages(data.nextCursor !== null);
            } catch (error: unknown) {
                if (error instanceof Error)
                    console.error(error);
                else
                    console.error("error");

            } finally {
                setIsInitialLoading(false);
            }
        };
        fetchMessages();

        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (token) {
            const decoded = jwtDecode<UserPayload>(token);
            setCurrentUser(decoded);
        }

        const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'https://full-stack-chat.vercel.app/');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        const container = scrollContainerRef.current;

        const handleScroll = () => {
            if (container && container.scrollTop === 0 && !isInitialLoading && hasMoreMessages && !isLoadingMore) {
                loadMoreMessages();
            }
        };

        container?.addEventListener('scroll', handleScroll);

        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, [hasMoreMessages, isLoadingMore, loadMoreMessages, isInitialLoading]);

    useEffect(() => {
        if (!socket || !roomId) return;

        socket.emit('join_room', roomId);

        const handleNewMessage = (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        const handleUserTypingStart = (user: { name: string; userId: string }) => {
            setTypingUsers(prev => new Map(prev).set(user.userId, user.name));
        };
        const handleUserTypingStop = (user: { userId: string }) => {
            setTypingUsers(prev => {
                const newMap = new Map(prev);
                newMap.delete(user.userId);
                return newMap;
            });
        };
        socket.on('message_created', handleNewMessage);
        socket.on('user_typing_start', handleUserTypingStart);
        socket.on('user_typing_stop', handleUserTypingStop);

        return () => {
            socket.off('message_created', handleNewMessage);
            socket.off('user_typing_start', handleUserTypingStart);
            socket.off('user_typing_stop', handleUserTypingStop);
        };

    }, [socket, roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        if (newMessage.trim() && socket && roomId) {
            socket.emit('send_message', {
                roomId,
                content: newMessage,
            });
            setNewMessage('');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        setNewMessage(value);

        if (!socket || !roomId) return;

        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }
        socket.emit('typing_start', { roomId });


        // eğer iki saniye yazmazsa o zaman yazıyor ifadesi iptal olur
        typingTimerRef.current = setTimeout(() => {
            socket.emit('typing_stop', { roomId });
        }, 2000);
    };

    const typingDisplay = Array.from(typingUsers.values()).join(', ');

    if (isInitialLoading) {
        return <RoomPageSkeleton />;
    }


    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
            <header className="p-4 border-b bg-white dark:bg-gray-800 shadow-sm">
                <h1 className="text-xl font-bold">Chat Room</h1>
            </header>

            <main ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMore && <div className="text-center text-gray-500">Loading more messages</div>}

                {!hasMoreMessages && <div className="text-center text-gray-500">All messages</div>}

                {messages.map((msg, index) => {
                    const prevMessage = messages[index - 1];
                    const showDateSeparator =
                        !prevMessage ||
                        new Date(msg.createdAt).toDateString() !== new Date(prevMessage.createdAt).toDateString();

                    return (
                        <div key={msg._id}>
                            {showDateSeparator && <DateSeparator date={msg.createdAt} />}
                            <MessageItem
                                message={msg}
                                currentUser={currentUser}
                                socket={socket}
                            />
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 bg-white dark:bg-gray-800 border-t">
                <div className="h-6 text-sm text-gray-500 italic">
                    {typingDisplay && `${typingDisplay} writing...`}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder="Write a message..."
                        autoComplete="off"
                    />
                    <Button type="submit">Send</Button>
                </form>
            </footer>
        </div>
    );
}