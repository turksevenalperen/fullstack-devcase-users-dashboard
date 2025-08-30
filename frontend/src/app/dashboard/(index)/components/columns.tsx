/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XCircleIcon,
  ClockIcon,
  Trash2Icon,
  PencilIcon,
} from "lucide-react";
import { deleteUser } from "@/lib/api";
import { User } from "@/lib/types/users";
type RowUser = User & { children?: User[]; firstName?: string; lastName?: string };
export const usersColumns = (currentUser?: User, onUserDeleted?: () => void, onEdit?: (user: RowUser) => void, onLoadChildren?: (parentId: string) => Promise<void>): ColumnDef<RowUser>[] => {
  return [
    {
      id: "select",
      size: 10,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(checked: any) => table.toggleAllRowsSelected(!!checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked: any) => row.toggleSelected(!!checked)}
          aria-label="Select row"
        />
      ),
    },
    {
      id: "expander",
      header: "",
      size: 24,
      cell: ({ row }) => {
        const canExpand =
          row.getCanExpand?.() ??
          Boolean((row.original as RowUser).children?.length);
        if (!canExpand) return null;
        const toggleHandler = row.getToggleExpandedHandler?.();
        return (
          <Button
            size="icon"
            variant="ghost"
            onClick={async () => {
              try {
                const orig = row.original as RowUser | undefined;
                if (orig && (!Array.isArray(orig.children) || orig.children.length === 0)) {
                  if (onLoadChildren && orig.id) {
                    await onLoadChildren(String(orig.id));
                  }
                }
              } catch (err) {
               
              }
              if (toggleHandler) toggleHandler();
            }}
            aria-label={row.getIsExpanded?.() ? "Collapse" : "Expand"}
          >
            {row.getIsExpanded?.() ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "user",
      header: "User",
      minSize: 300,
      cell: ({ row }) => {
        return (
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: (row.depth ?? 0) * 16 }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-700 font-bold text-lg select-none">
              {((row.original.firstName?.[0] || "") + (row.original.lastName?.[0] || "")).toUpperCase() || "K"}
            </div>
            <div>
              <p className="font-bold">{(row.original.firstName || "") + (row.original.lastName ? " " + row.original.lastName : "") || "Kullanıcı"}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => row.original.role,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = (row.original as any).status;
        if (status === "active") {
          return (
            <Badge
              className="w-30 py-2 font-semibold text-sm bg-[#89D2331A] text-[#89D233]"
              variant="default"
            >
              <CheckCircleIcon className="size-4!" />
              Active
            </Badge>
          );
        }

        if (status === "pending") {
          return (
            <Badge
              className="w-30 py-2 font-semibold text-sm bg-[#F7D77A1A] text-[#D6A800]"
              variant="default"
            >
              <ClockIcon className="size-4!" />
              Pending
            </Badge>
          );
        }

        return (
          <Badge
            className="w-30 py-2 font-semibold text-sm bg-[#F272771A] text-[#F27277]"
            variant="destructive"
          >
            <XCircleIcon className="size-4!" />
            Inactive
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        if (currentUser?.role === "admin") {
          return (
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit && onEdit(user)}
                aria-label="Edit user"
              >
                <PencilIcon className="size-4 text-blue-500" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={async () => {
                  if (confirm(`Delete user ${user.fullName}?`)) {
                    await deleteUser(String(user.id));
                    if (onUserDeleted) onUserDeleted();
                  }
                }}
                aria-label="Delete user"
              >
                <Trash2Icon className="size-4 text-red-500" />
              </Button>
            </div>
          );
        }
        return null;
      },
    },
  ];
};
