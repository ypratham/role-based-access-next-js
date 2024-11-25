"use client";

import AccessDenied from "@/components/access-denined";
import { PermissionTableActionsDropdown } from "@/components/permissions-table-actions";
import { GlobalTable } from "@/components/ui/global-table";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermission } from "@/hooks/user-permission";
import { api } from "@/trpc/react";
import { Permission } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Permission>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "source",
    header: "Scope",
  },
  {
    header: "Permissions",
    cell: ({ row }) => (
      <p className="text-xs">
        {"["}
        {row.original.actions.map(
          (i, index) => `${index === 0 ? "" : ", "}${i} `,
        )}
        {"]"}
      </p>
    ),
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    header: "Action",
    cell(props) {
      return <PermissionTableActionsDropdown id={props.row.getValue("id")} />;
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
];

export default function PermissionsDashboardPage() {
  const { data, isLoading, isFetching } = api.permission.fetchAll.useQuery();

  const { hasPermission, isLoading: isValidatingPermission } = usePermission(
    "PERMISSIONS",
    "READ",
  );

  if (isLoading || isFetching || isValidatingPermission)
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-full" />
      </div>
    );

  if (!hasPermission) {
    return <AccessDenied />;
  }

  return (
    <section className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Manage Permission</h2>

      <GlobalTable
        columns={columns}
        //   @ts-ignore
        data={data ?? []}
      />
    </section>
  );
}
