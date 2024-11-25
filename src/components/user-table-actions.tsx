import * as React from "react";
import {
  MoreHorizontal,
  Trash,
  Edit,
  Power,
  User2Icon,
  User,
} from "lucide-react";

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
import { usePermission } from "@/hooks/user-permission";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface TableActionsDropdownProps {
  id: string;
  isActive: boolean;
}

export function UserTableActionsDropdown({
  id,
  isActive,
}: TableActionsDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const userDeleteAccess = usePermission("ROLES", "DELETE");
  const userWriteAccess = usePermission("ROLES", "WRITE");

  const context = api.useUtils();

  const deleteUser = api.user.deleteUser.useMutation({
    onSuccess: () => {
      context.user.fetchAll.invalidate();
    },
  });
  const updateUserStatus = api.user.updateUserAccountStatus.useMutation({
    onSuccess: () => {
      context.user.fetchAll.invalidate();
    },
  });

  const onDelete = () => {
    toast.promise(deleteUser.mutateAsync({ id }), {
      loading: "Deleting user...",
      success: "Deleted user from database.",
    });
  };

  const onDeactivate = () => {
    toast.promise(updateUserStatus.mutateAsync({ id, isActive: false }), {
      loading: "Updating user status...",
      success: "User account deactivated.",
      error(data) {
        return data.message;
      },
    });
  };

  const onActivateAccount = () => {
    toast.promise(updateUserStatus.mutateAsync({ id, isActive: true }), {
      loading: "Updating user status...",
      success: "User account activated.",
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!userWriteAccess.hasPermission && !userDeleteAccess.hasPermission && (
          <DropdownMenuItem disabled>No actions</DropdownMenuItem>
        )}

        {userWriteAccess.hasPermission && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/user/${id}/edit`}>
                <User className="h-4 w-4" />
                Manage access
              </Link>
            </DropdownMenuItem>

            {isActive ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Power className="h-4 w-4" />
                    Deactivate
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to deactivate?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will deactivate the item. You can reactivate
                      it later if needed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setOpen(false);
                        onDeactivate();
                      }}
                    >
                      Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Power className="h-4 w-4" />
                    Activate
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to activate?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will activate user account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setOpen(false);
                        onActivateAccount();
                      }}
                    >
                      Activate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>
        )}

        <DropdownMenuSeparator />
        {userDeleteAccess.hasPermission && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600"
              >
                <Trash className="h-4 w-4" />
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
