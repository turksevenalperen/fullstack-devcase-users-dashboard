"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser, registerUser } from "@/lib/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser({ email, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        router.push("/dashboard");
      } else {
        setError("Giriş başarısız");
      }
    } catch {
      setError("Giriş başarısız");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await registerUser({ email, password, firstName, lastName, role: "user", status: "active" });
      if (res.success) {
        setRegisterMode(false);
        setError("");
      } else {
        setError("Kayıt başarısız");
      }
    } catch {
      setError("Kayıt başarısız");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {registerMode ? (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-center">Kayıt Ol</h2>
          <form onSubmit={handleRegister} className="space-y-4">
          <Input
            placeholder="Ad"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            type="text"
          />
          <Input
            placeholder="Soyad"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            type="text"
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
          />
          <Input
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
          {error && <div className="text-red-500">{error}</div>}
          <Button type="submit">Kayıt Ol</Button>
          <Button type="button" variant="ghost" onClick={() => setRegisterMode(false)}>
            Girişe Dön
          </Button>
          </form>
        </>
        ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-center">Giriş Yap</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
          />
          <Input
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
          {error && <div className="text-red-500">{error}</div>}
          <Button type="submit">Giriş Yap</Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/register")}> 
            Kayıt Ol
          </Button>
          </form>
        </>
        )}
      </div>
    </div>
  );
}
