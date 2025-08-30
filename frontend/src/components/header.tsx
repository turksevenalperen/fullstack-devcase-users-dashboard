/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  BellIcon,
  ChevronDownIcon,
  GlobeIcon,
  LogOutIcon,
  MailIcon,
  Menu,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Header() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  const { toggleSidebar } = useSidebar();
  const [user, setUser] = useState<{ firstName: string; lastName: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);

  const applyTheme = (dark: boolean) => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (e) {
    }
    setIsDark(dark);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") applyTheme(true);
      else if (saved === "light") applyTheme(false);
      else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(Boolean(prefersDark));
      }
    } catch (e) {
    }
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setError("Kullanıcı bilgisi alınamadı");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <Card className="-mt-6 lg:my-0 -mx-[30px] lg:mx-0 rounded-none lg:rounded-xl py-[30px]! lg:py-6! shadow-none p-6 flex-row items-center justify-center">
        <div className="flex items-center justify-center w-full h-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-lg text-muted-foreground">Yükleniyor...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="-mt-6 lg:my-0 -mx-[30px] lg:mx-0 rounded-none lg:rounded-xl py-[30px]! lg:py-6! shadow-none p-6 flex-row items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full h-16">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Yeniden Dene
          </button>
        </div>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="-mt-6 lg:my-0 -mx-[30px] lg:mx-0 rounded-none lg:rounded-xl py-[30px]! lg:py-6! shadow-none p-6 flex-row items-center justify-center">
        <div className="flex items-center justify-center w-full h-16">
          <span className="text-muted-foreground">Kullanıcı bulunamadı</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="-mt-6 lg:my-0 -mx-[30px] lg:mx-0 rounded-none lg:rounded-xl py-[30px]! lg:py-6! shadow-none p-6 flex-row items-center justify-center">
      <picture>
        <img
          src="/images/logo-icon.svg"
          alt="master POS"
          className="md:hidden"
        />
      </picture>
      <div className="flex-1 lg:hidden block" />
      <div className="hidden flex-1 lg:flex flex-col">
        <p className="text-2xl font-bold">Users</p>
        <p className="text-muted-foreground">Manage your users</p>
      </div>
      <div className="hidden lg:flex items-center justify-center gap-3">
        <SunIcon className="size-5" />
        <Switch
          checked={isDark}
          onCheckedChange={(val) => applyTheme(Boolean(val))}
          className="[&_[data-slot=switch-thumb]]:bg-primary [&_[data-slot=switch-thumb]]:size-6 h-6 w-12 data-[state=checked]:bg-input"
        />
        <MoonIcon className="size-5" />
      </div>
      <div className="hidden lg:block w-px h-full bg-border" />
      <div className="hidden lg:flex gap-[30px] items-center justify-center">
        <GlobeIcon className="size-5" />
        <div className="relative">
          <BellIcon className="size-5" />
          <Badge
            variant="accent"
            className="absolute -top-4 -right-4 size-6 rounded-full font-semibold"
          >
            12
          </Badge>
        </div>
        <MailIcon className="size-5" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="px-2! py-2 h-auto hover:bg-input hover:text-inherit"
          >
            <Avatar className="h-12 w-12 rounded-full grayscale">
              <AvatarFallback className="rounded-lg">{user ? user.firstName[0] + user.lastName[0] : "CN"}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user ? `${user.firstName} ${user.lastName}` : ""}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user ? user.role : "Super Admin"}
              </span>
            </div>
            <ChevronDownIcon className="ml-3 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
          <DropdownMenuItem onClick={handleLogout}>
            <LogOutIcon className="size-5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        size="icon"
        variant="ghost"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="size-7" />
      </Button>
    </Card>
  );
}
