
export interface User {
  id: string; 
  firstName?: string;
  lastName?: string;
  fullName?: string; 
  email: string;
  avatarUrl?: string;
  role?: "admin" | "manager" | "user" | "staff" | "viewer";
  status?: "active" | "inactive" | "pending";
  isActive?: boolean;
  createdAt?: string; 
  children?: User[];
}


export interface UsersResponse {
  message?: string;
  status?: string;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  data: User[];
  meta?: Record<string, unknown>;
}
