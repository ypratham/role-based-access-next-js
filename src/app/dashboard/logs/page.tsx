"use client";

import AccessDenied from "@/components/access-denined";
import { LogsTableActionsDropdown } from "@/components/logs-table-actions";
import { Button } from "@/components/ui/button";
import { GlobalTable } from "@/components/ui/global-table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserTableActionsDropdown } from "@/components/user-table-actions";
import { usePermission } from "@/hooks/user-permission";
import { api } from "@/trpc/react";
import { Logs, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

interface Cos extends Logs {
  User_Logs_userIdToUser: {
    id: string;
    name: string | null;
  };
}

const columns: ColumnDef<Cos>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "User_Logs_userIdToUser.id",
    header: "User ID",
  },
  {
    accessorKey: "User_Logs_userIdToUser.name",
    header: "Username",
  },
  {
    accessorKey: "created_at",
    header: "Created at",
  },

  {
    header: "Action",
    cell: ({ row }) => <LogsTableActionsDropdown id={row.getValue("id")} />,
  },
];

export default function UserDashboardPage() {
  const { data, isLoading } = api.logs.fetchAll.useQuery();

  const { hasPermission, isLoading: isValidatingPermission } = usePermission(
    "LOGS",
    "READ",
  );

  if (isLoading || isValidatingPermission)
    return (
      <div className="p-4">
        <Skeleton className="h-12 w-full" />
      </div>
    );

  if (!hasPermission) {
    return <AccessDenied />;
  }

  return (
    <section className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Logs</h2>
      <GlobalTable columns={columns} data={data ?? []} />
    </section>
  );
}
