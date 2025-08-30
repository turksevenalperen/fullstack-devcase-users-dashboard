/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export async function fetchUsers(params: Record<string, any> = {}) {
  const response = await api.get("/users", { params });
  return response.data;
}

export async function fetchUser(id: string) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function createUser(data: any) {
  const response = await api.post("/users", data);
  return response.data;
}

export async function updateUser(id: string, data: any) {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: string) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function registerUser({ email, password, firstName, lastName, role = "user", status }: { email: string; password: string; firstName: string; lastName: string; role?: string; status?: string }) {
  const payload: any = { email, password, firstName, lastName, role };
  if (typeof status !== 'undefined') payload.status = status;
  const res = await api.post("/auth/register", payload);
  return res.data;
}