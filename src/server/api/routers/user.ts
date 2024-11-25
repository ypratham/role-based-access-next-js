import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { error } from "console";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  fetchAll: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      include: {
        Roles: {
          select: {
            name: true,
          },
        },
      },
    });

    return users;
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  fetchUserById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input: { id } }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          id,
        },
      });
      return user;
    }),

  deleteUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      if (id == ctx.session.user.id) throw error("Cannot delete the same user");

      await ctx.db.user.delete({
        where: { id },
        include: {
          accounts: true,
        },
      });

      await ctx.db.logs.create({
        data: {
          type: "DELETE",
          source: "USER",
          userId: ctx.session.user.id,
          message: `${ctx.session.user.name} deleted ${id} user`,
          updatedUserId: id,
        },
      });

      return { message: "User deleted " };
    }),

  updateUserAccountStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isActive: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input: { id, isActive } }) => {
      if (id == ctx.session.user.id)
        throw new TRPCError({
          message: "Cannot deactivate self account",
          code: "CONFLICT",
          cause: "Account activate",
        });

      await ctx.db.user.update({
        where: { id },
        data: {
          isActive,
        },
      });

      await ctx.db.logs.create({
        data: {
          type: "UPDATE",
          source: "USER",
          userId: ctx.session.user.id,
          message: `${ctx.session.user.name} updated ${id} user status`,
          updatedUserId: id,
        },
      });

      return { message: "User status updated " };
    }),

  editUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          id: input.id,
        },
      });

      if (user) {
        await ctx.db.user.update({
          data: {
            name: input.name,
            email: input.email,
          },
          where: {
            id: input.id,
          },
        });

        await ctx.db.logs.create({
          data: {
            type: "UPDATE",
            source: "USER",
            userId: ctx.session.user.id,
            message: `${ctx.session.user.name} updated ${input.id} user`,
            updatedUserId: input.id,
          },
        });

        return { message: "User updated successfully" };
      }
    }),

  assignRoleToUser: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { roleId, userId } }) => {
      await ctx.db.user.update({
        where: { id: userId },
        data: {
          roleId: roleId,
        },
      });

      await ctx.db.logs.create({
        data: {
          type: "UPDATE",
          source: "USER",
          userId: ctx.session.user.id,
          message: `${ctx.session.user.name} updated role for ${userId} user`,
          updatedUserId: userId,
        },
      });

      return "Role assigned";
    }),

  getPermissions: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
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
      cacheStrategy: {
        ttl: 60,
        swr: 60,
      },
    });

    return (
      user?.Roles?.RolesPermissionJoin.map((join) => join.Permission).filter(
        Boolean,
      ) || []
    );
  }),

  getAccountStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        isActive: true,
      },
      cacheStrategy: {
        ttl: 60,
        swr: 60,
      },
    });

    return user;
  }),
});
