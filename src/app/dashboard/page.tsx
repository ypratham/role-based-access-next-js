"use client";

import AccessDenied from "@/components/access-denined";
import { Button } from "@/components/ui/button";
import { GlobalTable } from "@/components/ui/global-table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserTableActionsDropdown } from "@/components/user-table-actions";
import { usePermission } from "@/hooks/user-permission";
import { api } from "@/trpc/react";
import { SOURCES, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <StatusBadge isActive={row.getValue("isActive")} />,
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <UserTableActionsDropdown
        isActive={row.getValue("isActive")}
        id={row.getValue("id")}
      />
    ),
  },
];

export default function UserDashboardPage() {
  const { data, isLoading } = api.user.fetchAll.useQuery();

  const { hasPermission, isLoading: isValidatingPermission } = usePermission(
    "USER",
    "READ",
  );

  if (isLoading || isValidatingPermission)
    return (
      <section className="flex flex-col gap-4 p-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </section>
    );

  if (!hasPermission) {
    return <AccessDenied />;
  }

  return (
    <section className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Manage users</h2>
      <GlobalTable columns={columns} data={data ?? []} />
    </section>
  );
}
