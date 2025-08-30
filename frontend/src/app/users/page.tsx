"use client";

import React, { Suspense } from "react";
import UserList from "../dashboard/(index)/components/user-list";

export default function UsersPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<div>Loading users...</div>}>
        <UserList />
      </Suspense>
    </div>
  );
}
