import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { ACTIONS, SOURCES } from "@prisma/client";
import { NextRequest } from "next/server";

export interface PermissionCheck {
  source: SOURCES;
  action: ACTIONS;
}

export async function checkUserPermission(
  req: NextRequest,
  requiredPermission: PermissionCheck,
): Promise<boolean> {
  // Get the current user's session
  const session = await auth();

  if (!session?.user) {
    return false;
  }

  // Fetch user with their role and associated permissions
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      Roles: {
        include: {
          RolesPermissionJoin: {
            include: {
              Permission: true,
            },
          },
        },
      },
    },
  });

  if (!user?.Roles) {
    return false;
  }

  return user.Roles.RolesPermissionJoin.some(
    (rolePermission) =>
      rolePermission.Permission?.source === requiredPermission.source &&
      rolePermission.Permission?.actions.includes(requiredPermission.action),
  );
}
