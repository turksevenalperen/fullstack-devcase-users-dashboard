"use client";

import { DataTable } from "@/components/ui/data-table";
import { User } from "@/lib/types/users";
import { SortingState } from "@tanstack/react-table";

export default function CommentsDataTable({
  data,
  pagination,
  onPaginationChange,
  onSortingChange,
  sorting,
  columns,
}: {
  data: (User & { children?: User[] })[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  sorting: SortingState;
  columns: import("@tanstack/react-table").ColumnDef<User & { children?: User[] }>[],
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      getSubRows={(row) => (row as User & { children?: User[] }).children}
      manualPagination
      pageCount={pagination.totalPages}
      pageIndex={pagination.page - 1}
      onPaginationChange={onPaginationChange}
      manualSorting
      onSortingChange={onSortingChange}
      sorting={sorting}
      total={pagination.totalItems}
    />
  );
}
