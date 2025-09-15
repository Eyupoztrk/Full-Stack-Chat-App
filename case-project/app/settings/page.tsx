"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [initialName, setInitialName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/me");
        if (!response.ok) throw new Error("Profile information could not be retrieved.");
        const data = await response.json();
        setName(data.user.name);
        setInitialName(data.user.name);
      } catch (error: unknown) {
        if (error instanceof Error)
          setMessage({ type: "error", text: "unknown error" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed.");

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setInitialName(name);
    } catch (error: unknown) {
      if (error instanceof Error)
        setMessage({ type: "error", text: "unknown error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Profile Settings</CardTitle>
          <CardDescription>
            You can update your profile information here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new name"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {message && (
              <p
                className={`text-sm font-medium ${message.type === "error" ? "text-red-500" : "text-green-600"
                  }`}
              >
                {message.text}
              </p>
            )}

            <div className="flex justify-between items-center gap-3">
              <Button
                type="submit"
                disabled={isSaving || name === initialName}
                className="px-6 bg- bg-green-600 hover:bg-green-800"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Return to Home Page</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
