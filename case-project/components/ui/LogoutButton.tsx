'use client';

import { useRouter } from 'next/navigation';
import { Button } from './button';

const LogoutButton = () => {

    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });

        router.push('/login');
        router.refresh(); 
    };

    return (
        <Button onClick={handleLogout} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
            Logout
        </Button>
    );
}

export default LogoutButton