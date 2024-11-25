import { api } from "@/trpc/react";
import { ACTIONS, SOURCES } from "@prisma/client";

export function usePermission(source: SOURCES, action: ACTIONS) {
  const { data: permissions, isLoading } = api.user.getPermissions.useQuery(
    {},
    {
      refetchOnMount: false,
      experimental_prefetchInRender: true,
    },
  );

  const hasPermission = permissions?.some(
    (perm) => perm?.source === source && perm.actions.includes(action),
  );

  return {
    hasPermission,
    isLoading: isLoading,
  };
}
