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
import { api } from "@/trpc/react";
import { usePermission } from "@/hooks/user-permission";

interface TableActionsDropdownProps {
  id: string;
}

export function LogsTableActionsDropdown({ id }: TableActionsDropdownProps) {
  const { mutate, isPending } = api.logs.deleteLogs.useMutation();

  const { hasPermission, isLoading: isValidatingPermission } = usePermission(
    "LOGS",
    "DELETE",
  );

  const onDelete = () => {
    mutate({
      id,
    });
  };

  if (!hasPermission) return;

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant={"destructive"} loading={isPending} size={"sm"}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the item
            and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onDelete();
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
