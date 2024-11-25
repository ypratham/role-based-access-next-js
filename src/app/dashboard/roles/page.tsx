"use client";

import AccessDenied from "@/components/access-denined";
import { RoleTableActionsDropdown } from "@/components/roles-table-actions";
import { GlobalTable } from "@/components/ui/global-table";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermission } from "@/hooks/user-permission";
import { RolesWithPermissionsResponse } from "@/server/api/routers/roles";
import { api } from "@/trpc/react";
import { Permission } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const columns: ColumnDef<RolesWithPermissionsResponse>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <p className="text-xs">{row.getValue("description")}</p>,
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return <RoleTableActionsDropdown id={row.getValue("id")} />;
    },
  },
];

export default function RolesDashboardPage() {
  const { data, isLoading } = api.roles.fetchAll.useQuery();

  const { hasPermission, isLoading: isValidatingPermission } = usePermission(
    "ROLES",
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
      <h2 className="text-2xl font-bold">Manage Roles</h2>

      <GlobalTable
        columns={columns}
        //   @ts-ignore
        data={data ?? []}
      />
    </section>
  );
}
