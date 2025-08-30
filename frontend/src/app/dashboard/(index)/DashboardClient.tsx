/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import { Card } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import UserList from "./components/user-list";
import { useRouter, useSearchParams } from "next/navigation";

interface DashboardData {
  totalUsers: number;
  newUsers: number;
}

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [inactiveCount, setInactiveCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const [totalData, newData, activeData, pendingData, inactiveData] = await Promise.all([
          fetch(`${API_URL}/users?page=1&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error('Failed to fetch total users');
            return res.json();
          }),
          fetch(`${API_URL}/users?page=1&limit=1000&sort=createdAt&order=desc`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error('Failed to fetch new users');
            return res.json();
          }),
          fetch(`${API_URL}/users?status=active&page=1&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error('Failed to fetch active users');
            return res.json();
          }),
          fetch(`${API_URL}/users?status=pending&page=1&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error('Failed to fetch pending users');
            return res.json();
          }),
          fetch(`${API_URL}/users?status=inactive&page=1&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error('Failed to fetch inactive users');
            return res.json();
          }),
        ]);

        const totalUsers = totalData?.meta?.total || 0;
        const users = newData?.data || [];
        const newUsers = users.filter((u: any) => new Date(u.createdAt) > new Date(since)).length;
  const activeUsersCount = activeData?.meta?.total || 0;
  const pendingUsersCount = pendingData?.meta?.total || 0;
  const inactiveUsersCount = inactiveData?.meta?.total || 0;

  setData({ totalUsers, newUsers });
  setActiveUsers(activeUsersCount);
  setPendingCount(pendingUsersCount);
  setInactiveCount(inactiveUsersCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="text-lg text-muted-foreground">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 mb-4">Veri yüklenirken hata oluştu: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Yeniden Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Veri bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
  <CardItem title="Active Users" value={activeUsers} percentage={15} />
  <CardItem title="New Users" value={data.newUsers} percentage={data.newUsers > 0 ? 100 : 0} />
  <CardItem title="Verified Users" value={data.totalUsers} percentage={-4.5} />
  <CardItem title="Pending Users" value={pendingCount} percentage={pendingCount > 0 ? 100 : 0} />
  <CardItem title="Deactivated Users" value={inactiveCount} percentage={inactiveCount > 0 ? -5 : 0} />
    </div>
  <UserList openNewUser={searchParams?.get('openNewUser') === '1'} />
    </>
  );
}

function CardItem({
  title,
  value,
  percentage,
}: {
  title: string;
  value: number;
  percentage: number;
}) {
  return (
    <Card className="gap-4 py-5 px-6">
      <p className="text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold">{formatNumber(value)}</p>
      <div
        className={cn("flex items-center gap-2", {
          "text-green-500": percentage > 0,
          "text-red-500": percentage < 0,
        })}
      >
        {percentage > 0 ? (
          <TrendingUpIcon className="size-4" />
        ) : (
          <TrendingDownIcon className="size-4" />
        )}
        <p className="font-bold">{percentage}%</p>
      </div>
    </Card>
  );
}