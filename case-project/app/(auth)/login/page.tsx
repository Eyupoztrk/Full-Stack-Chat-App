'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error!!");
      }

      router.push('/');
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error");
      }
    }


  }

  return (
  <div className="max-w-sm mx-auto mt-12 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
    <h1 className="text-2xl font-bold mb-6">Login</h1>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E Mail
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Button
        type="submit"
        className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
      >
       Login
      </Button>
    </form>

    <p className="mt-6 text-center text-sm text-gray-600">
      <Link href="/register" className="text-blue-600 hover:underline">
        Register
      </Link>
    </p>
  </div>
);


}