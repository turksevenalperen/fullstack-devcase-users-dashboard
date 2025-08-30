/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/api";
import { z } from "zod";

const clientRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await registerUser({ email, password, firstName, lastName, role, status: "active" });
      if (res && res.user) {
        setError("");
        router.push("/login");
      } else {
        setError("Kayıt başarısız");
      }
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setError("Bu email ile zaten kayıt olunmuş!");
      } else {
        setError("Kayıt başarısız");
      }
    }
  };

  const checks = useMemo(() => ({
    email: clientRegisterSchema.shape.email.safeParse(email).success,
    password: password.length >= 6,
    firstName: firstName.trim().length >= 2,
    lastName: lastName.trim().length >= 2,
    all: clientRegisterSchema.safeParse({ email, password, firstName, lastName }).success,
  }), [email, password, firstName, lastName]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
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
      <div className="mt-2 space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span className={`w-4 text-green-600 ${checks.email ? '' : 'text-gray-400'}`}>{checks.email ? '✓' : '○'}</span>
          <span>Email geçerli olmalı (@ ve domain)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-4 text-green-600 ${checks.password ? '' : 'text-gray-400'}`}>{checks.password ? '✓' : '○'}</span>
          <span>Şifre en az 6 karakter</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-4 text-green-600 ${checks.firstName ? '' : 'text-gray-400'}`}>{checks.firstName ? '✓' : '○'}</span>
          <span>Ad en az 2 karakter</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-4 text-green-600 ${checks.lastName ? '' : 'text-gray-400'}`}>{checks.lastName ? '✓' : '○'}</span>
          <span>Soyad en az 2 karakter</span>
        </div>
      </div>
      <div>
        <label htmlFor="role" className="block mb-1 text-sm text-muted-foreground">Rol Seçiniz</label>
        <select
          id="role"
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="user">Kullanıcı</option>
          <option value="manager">Yönetici</option>
          <option value="admin">Admin</option>
        </select>
      </div>
  {error && <div className="text-red-500">{error}</div>}
  <Button type="submit" disabled={!checks.all}>Kayıt Ol</Button>
        </form>
      </div>
    </div>
  );
}
