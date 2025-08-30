/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  PlusCircleIcon,
  RefreshCwIcon,
  Search,
  SearchIcon,
} from "lucide-react";

import CommentsDataTable from "./data-table";
import { usersColumns } from "./columns";
import { fetchUsers } from "@/lib/api";
import { SortingState } from "@tanstack/react-table";
import UserForm from "./user-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// ...existing code...

// User interface - id tipini tutarlı hale getirin
interface User {
  id: string; // veya number - API'nizle uyumlu olmalı
  fullName: string;
  email: string;
  avatarUrl: string;
  role: "admin" | "manager" | "staff" | "viewer";
  status: "active" | "inactive" | "pending" | undefined;
  isActive: boolean;
  createdAt: string;
  children?: User[];
}

type UserListProps = { onUserDeleted?: () => void; openNewUser?: boolean };
export default function UserList({ onUserDeleted, openNewUser }: UserListProps) {
  // ...existing code...
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [error, setError] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editUser, setEditUser] = useState<User | null>(null);

  // Recursively map server user objects to the client shape used by the table.
  // Ensures each node has `isActive` and children are mapped as well so
  // TanStack Table getSubRows can use `children` for expand/collapse.
  const mapServerUser = (u: any): User => {
    if (!u) return u;
    
    const mapped: User = { 
      ...u, 
      id: String(u.id), // ID'yi her zaman string'e çevir
      status: u.status as "active" | "inactive" | "pending" | undefined,
      isActive: u.status === "active" 
    };
    
    if (Array.isArray(u.children) && u.children.length > 0) {
      mapped.children = u.children.map(mapServerUser);
    }
    
    return mapped;
  };

  // Load children for a specific parent and inject into current users state.
  const loadChildrenFor = async (parentId: string) => {
    try {
      const res = await fetchUsers({ parentId, page: 1, limit: 100 });
      const children = (res.data || []).map(mapServerUser);
      // inject into users state by setting children on the matching parent
      setUsers((prev) =>
        prev.map((u) =>
          u.id === parentId // Artık her ikisi de string
            ? { ...u, children }
            : u
        )
      );
    } catch {
      // ignore
    }
  };

  // currentUser bilgisini bir kez çek
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
    fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((me) => {
        setCurrentUser(mapServerUser(me.user)); // mapServerUser ile normalize et
      })
      .catch(() => setCurrentUser(null));
  }, []);

  // Initialize local state from URL query params (page, search, role, status, sort, order)
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const sp = searchParams;
      if (!sp) return;
      const p = sp.get("page");
      const s = sp.get("search");
      const r = sp.get("role");
      const st = sp.get("status");
      const sort = sp.get("sort");
      const order = sp.get("order");
      setPagination((prev) => ({ ...prev, page: p ? Number(p) : prev.page }));
      if (s !== null) setSearch(s);
      if (r !== null) setRole(r);
      if (st !== null) setIsActive(st);
      if (sort) {
        setSorting([{ id: sort, desc: order === "desc" }]);
      }
    } catch {
      // ignore
    }
    // run only once on mount
  }, []);

  // Eğer query param ile gelindiyse formu aç
  useEffect(() => {
    if (openNewUser) setOpen(true);
  }, [openNewUser]);

  // Kullanıcı listesini çek, currentUser geldiyse kendi kaydını aktif yap
  useEffect(() => {
    setLoading(true);
    setError("");
    // derive sort/order from sorting state
    const sortObj = sorting[0];
    const sort = sortObj ? String(sortObj.id) : undefined;
    const order = sortObj ? (sortObj.desc ? 'desc' : 'asc') : undefined;
    fetchUsers({ page: pagination.page, search, role, status: isActive, sort, order })
      .then((res) => {
        // Map server users (recursively) so each node has isActive and children mapped.
        setUsers(res.data.map(mapServerUser));
        setPagination({
          page: res.meta.page,
          totalPages: res.meta.totalPages,
          totalItems: res.meta.total,
        });
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to fetch users"))
      .finally(() => setLoading(false));
  }, [pagination.page, search, role, isActive, currentUser, sorting]);

  // keep URL in sync with state (page, search, role, status, sort, order)
  useEffect(() => {
    try {
      const sortObj = sorting[0];
      const sort = sortObj ? String(sortObj.id) : undefined;
      const order = sortObj ? (sortObj.desc ? 'desc' : 'asc') : undefined;
      const params = new URLSearchParams();
      if (pagination.page) params.set('page', String(pagination.page));
      if (search) params.set('search', search);
      if (role) params.set('role', role);
      if (isActive) params.set('status', isActive);
      if (sort) params.set('sort', sort);
      if (order) params.set('order', order);
      const url = `${window.location.pathname}?${params.toString()}`;
      router.replace(url);
    } catch {
      // ignore
    }
  }, [pagination.page, search, role, isActive, sorting, router]);

  // Arama inputu değiştiğinde API'yi debounce ile tetikle
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 })); // Arama değişince ilk sayfaya dön
    }, 400);
    setSearchTimeout(timeout);
  };

  return (
    <Card className="gap-10 p-[30px]">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <p className="flex-1 font-bold text-xl">All Users</p>
        <div className="relative hidden md:block">
          <Input
            placeholder="Search here"
            className="pl-10 py-2!"
            value={search}
            onChange={handleSearchChange}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-px top-px p-[12px] [&_svg]:size-5!"
          >
            <Search />
          </Button>
        </div>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
        <Button size="icon" variant="ghost" className="border md:hidden">
          <SearchIcon />
        </Button>
        <Button size="icon" variant="ghost" className="border hidden md:flex">
          <RefreshCwIcon />
        </Button>
        <Button size="icon" variant="ghost" className="border hidden md:flex">
          <CalendarIcon />
        </Button>
        <Button size="icon" variant="ghost" className="border hidden md:flex">
          <FunnelIcon />
        </Button>
        <Button size="icon" variant="ghost" className="border">
          <EllipsisVerticalIcon />
        </Button>
        {currentUser?.role === "admin" && (
          <Sheet open={open} onOpenChange={(val: boolean) => {
            setOpen(val);
            if (!val) setEditUser(null);
          }}>
            <SheetTrigger asChild>
              <Button onClick={() => { setOpen(true); setEditUser(null); }}>
                <PlusCircleIcon /> Add New User
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="max-w-md w-full">
              <SheetHeader>
                <SheetTitle>{editUser ? "Edit User" : "Add New User"}</SheetTitle>
              </SheetHeader>
              <UserForm user={editUser} onSuccess={(returned) => {
                // returned is the server's response user object for both create and update
                const editUserId = editUser?.id ?? null;
                const wasEditing = Boolean(editUserId);
                setOpen(false);
                if (wasEditing) {
                  // update case: replace the edited user with server returned object
                  // normalize returned user to include isActive so the table renders correctly
                  if (returned && returned.id) {
                    const normalizedUser = mapServerUser(returned);
                    setUsers((prev) => prev.map((p) => (p.id === normalizedUser.id ? normalizedUser : p)));
                  } else {
                    // fallback: trigger a simple refresh by re-setting pagination
                    setPagination((prev) => ({ ...prev }));
                  }
                  setEditUser(null);
                } else {
                  // create case: prepend
                  setEditUser(null);
                  if (returned) {
                    const normalizedUser = mapServerUser(returned);
                    setUsers((prev) => [normalizedUser, ...prev]);
                    setPagination((prev) => ({ ...prev, totalItems: prev.totalItems + 1 }));
                  }
                }
              }} />
            </SheetContent>
          </Sheet>
        )}
      </div>
      <CommentsDataTable
        data={users}
        pagination={pagination}
        onPaginationChange={(pageIndex) => {
          setPagination((prev) => ({ ...prev, page: pageIndex + 1 }));
        }}
        onSortingChange={setSorting}
        sorting={sorting}
        columns={usersColumns(currentUser ?? undefined, onUserDeleted, (u) => {
          // open edit sheet for selected user
          setEditUser(u as User);
          setOpen(true);
        }, loadChildrenFor)}
      />
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}
      {!loading && users.length === 0 && !error && (
        <div className="text-center py-4 text-muted-foreground">No users found.</div>
      )}
    </Card>
  );
}