'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LogoutButton from '@/components/ui/LogoutButton';
import { Button } from '@/components/ui/button';
import { UserPayload, Room } from '@/types/index';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';

export default function DashboardPage() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<{ name: string }[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();




  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/me', {
          credentials: 'include',
        });

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        setUser(data.user);

      } catch (error) {
        console.error("Profil alınamadı:", error);
        router.push('/login');
      }
    };
    fetchProfile();

    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setRooms(data.rooms || []);
        }
      } catch (error) {
        console.error("Odalar alınamadı:", error);
      }
    };
    fetchRooms();

    const newSocket = io(process.env.NEXT_PUBLIC_APP_URL  || 'http://localhost:3000', {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [router]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users: { name: string }[]) => {
      setOnlineUsers(users);
    };

    socket.on('online_users_update', handleOnlineUsers);

    return () => {
      socket.off('online_users_update', handleOnlineUsers);
    };
  }, [socket]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
       <DashboardSkeleton />;
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        <div className="md:col-span-1 lg:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-lg">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href="/settings">Settings</Link>
                </Button>
                <LogoutButton />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Active users ({onlineUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {onlineUsers.map((onlineUser, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span>{onlineUser.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Chat rooms</CardTitle>
            </CardHeader>
            <CardContent>
              {rooms.length > 0 ? (
                <ul className="space-y-3">
                  {rooms.map((room) => (
                    <li key={room._id}>
                      <Link
                        href={`/rooms/${room._id}`}
                        className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <p className="font-medium">{room.name}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  No chat rooms
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}