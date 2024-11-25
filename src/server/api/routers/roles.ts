import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { inferRouterOutputs } from "@trpc/server";

export const rolesRouter = createTRPCRouter({
  fetchAll: publicProcedure.query(async ({ ctx }) => {
    const roles = await ctx.db.roles.findMany({
      include: {
        RolesPermissionJoin: {
          include: {
            Permission: true,
          },
        },
      },
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      created_at: role.created_at,
      permissions: role.RolesPermissionJoin.map(
        (join) => join.Permission,
      ).filter(
        (permission): permission is NonNullable<typeof permission> =>
          permission !== null,
      ),
    }));
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        permissions: z.array(z.bigint()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const role = await ctx.db.roles.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });

      input.permissions.forEach(async (permission) => {
        await ctx.db.rolesPermissionJoin.create({
          data: {
            permissionId: permission,
            roleId: role.id,
          },
        });
      });

      await ctx.db.logs.create({
        data: {
          type: "WRITE",
          source: "ROLES",
          userId: ctx.session.user.id,
          message: `Created new role:  ${input.name}`,
        },
      });

      return "Created role";
    }),

  editById: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        permissions: z.array(z.bigint()),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const roleExists = await ctx.db.roles.count({
        where: {
          id: input.id,
        },
      });

      if (roleExists > 0) {
        await ctx.db.roles.update({
          data: {
            name: input.name,
            description: input.description,
          },
          where: {
            id: input.id,
          },
        });

        input.permissions.forEach(async (permission) => {
          await ctx.db.rolesPermissionJoin.create({
            data: {
              permissionId: permission,
              roleId: input.id,
            },
          });
        });

        await ctx.db.logs.create({
          data: {
            type: "UPDATE",
            source: "ROLES",
            userId: ctx.session.user.id,
            message:
              input.permissions.length < 0
                ? "Updated roles details"
                : `Updated permissions and details for the role ${input.id}`,
          },
        });

        return {
          message: "Role updated",
        };
      } else {
        return {
          message: "Role doesn't exists",
        };
      }
    }),

  fetchById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const res = await ctx.db.roles.findUnique({
        where: { id },
        include: {
          RolesPermissionJoin: {
            select: {
              permissionId: true,
            },
          },
        },
      });

      return res;
    }),

  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.roles.delete({
        where: { id },
      });

      await ctx.db.logs.create({
        data: {
          type: "DELETE",
          source: "ROLES",
          userId: ctx.session.user.id,
          message: `${id} role deleted`,
        },
      });

      return "Deleted roles record";
    }),
});

export type RolesWithPermissionsResponse = inferRouterOutputs<
  typeof rolesRouter
>["fetchAll"];
