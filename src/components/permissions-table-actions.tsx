import * as React from "react";
import { MoreHorizontal, Trash, Edit, Power } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { usePermission } from "@/hooks/user-permission";

interface TableActionsDropdownProps {
  id: string;
}

export function PermissionTableActionsDropdown({
  id,
}: TableActionsDropdownProps) {
  const [open, setOpen] = React.useState(false);

  const context = api.useUtils();

  const { mutateAsync, isPending } =
    api.permission.deletePermission.useMutation({
      onSuccess: () => {
        context.permission.fetchAll.invalidate();
      },
    });

  const onDelete = () => {
    toast.promise(
      mutateAsync({
        id: BigInt(id),
      }),
      {
        loading: "Removing permission, please wait...",
        success: "Deleted permission record from database",
      },
    );
  };

  const permissionWriteAccess = usePermission("PERMISSIONS", "WRITE");
  const permissionDeleteAccess = usePermission("PERMISSIONS", "DELETE");

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" loading={isPending} className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!permissionWriteAccess.hasPermission &&
          !permissionDeleteAccess.hasPermission && (
            <DropdownMenuItem disabled>No actions</DropdownMenuItem>
          )}

        {permissionWriteAccess.hasPermission && (
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/permission/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        {permissionDeleteAccess && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  item and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setOpen(false);
                    onDelete();
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
