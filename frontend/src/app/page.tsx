"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          router.replace("/dashboard");
        } else if (res.status === 401) {
          localStorage.removeItem("token");
          router.replace("/login");
        } else {
          localStorage.removeItem("token");
          router.replace("/login");
        }
      } catch (err) {
        console.error('Auth check failed', err);
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };
    check();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Yönlendiriliyorsunuz...</p>
      </div>
    </div>
  );
}
