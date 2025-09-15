'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={<div>Loading..</div>}>
      <VerifyPage />
    </Suspense>
  );
}
function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Your account is being verified, please wait...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('The verification link is invalid or missing.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`, {
          method: 'GET',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error');
        }

        setStatus('success');
        setMessage(data.message || 'Your account has been verify successfully!');

      } catch (error: unknown) {
        if (error instanceof Error) {
          setStatus('error');
          setMessage(error.message);
        } else {
          setStatus('error');
          setMessage("error");
        }
      }
    };

    verifyToken();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center gap-4">

            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
            <p className="text-lg font-medium text-gray-600">{message}</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
            <p className="text-gray-700 mb-6">{message}</p>
            <Button asChild>
              <Link href="/login">Continue Logging In</Link>
            </Button>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error!</h2>
            <p className="text-gray-700 mb-6">{message}</p>
            <Button variant="outline" asChild>
              <Link href="/register">Register Again</Link>
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8 border border-gray-200 rounded-lg shadow-lg bg-white">
        {renderContent()}
      </div>
    </div>
  );
}


