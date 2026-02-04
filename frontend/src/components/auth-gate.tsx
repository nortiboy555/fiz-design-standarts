"use client";

import { useState, useEffect, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AUTH_KEY = "fiz-auth";

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(stored === "true");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem(AUTH_KEY, "true");
        setIsAuthenticated(true);
      } else {
        setError(true);
        setPassword("");
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-border/40">
          <CardHeader className="text-center">
            <div className="text-2xl font-bold text-indigo-400 mb-2">FIZ Creative Hub</div>
            <CardTitle className="text-base font-normal text-muted-foreground">
              Enter password to continue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Password"
                autoFocus
                disabled={isLoading}
                className={error ? "border-destructive" : ""}
              />
              {error && (
                <p className="text-sm text-destructive">Incorrect password</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Checking..." : "Enter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated - show app
  return <>{children}</>;
}
