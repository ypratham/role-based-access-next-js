import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { ACTIONS, SOURCES } from "@prisma/client";

export const permissionRouter = createTRPCRouter({
  fetchAll: publicProcedure.query(async ({ ctx }) => {
    const permission = await ctx.db.permission.findMany();

    return permission;
  }),
  fetchById: publicProcedure
    .input(z.object({ id: z.bigint() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const permission = await ctx.db.permission.findUnique({
        where: {
          id,
        },
      });

      return permission;
    }),

  create: protectedProcedure
    .input(
      z.object({
        source: z.enum([
          SOURCES.USER,
          SOURCES.LOGS,
          SOURCES.PERMISSIONS,
          SOURCES.POSTS,
          SOURCES.ROLES,
        ]),
        actions: z.array(
          z.enum([ACTIONS.DELETE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.WRITE]),
        ),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.permission.create({
        data: {
          source: input.source,
          actions: input.actions,
          name: input.name,
        },
      });

      await ctx.db.logs.create({
        data: {
          type: "WRITE",
          source: "PERMISSIONS",
          userId: ctx.session.user.id,
          message: "New permission created",
        },
      });

      return;
    }),

  updatePermissions: protectedProcedure
    .input(
      z.object({
        source: z.enum([
          SOURCES.USER,
          SOURCES.LOGS,
          SOURCES.PERMISSIONS,
          SOURCES.POSTS,
          SOURCES.ROLES,
        ]),
        actions: z.array(
          z.enum([ACTIONS.DELETE, ACTIONS.READ, ACTIONS.UPDATE, ACTIONS.WRITE]),
        ),
        name: z.string(),
        id: z.bigint(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.permission.update({
        data: {
          source: input.source,
          actions: input.actions,
          name: input.name,
        },
        where: {
          id: input.id,
        },
      });

      await ctx.db.logs.create({
        data: {
          type: "UPDATE",
          source: "PERMISSIONS",
          userId: ctx.session.user.id,
          message: `Permission updated for ${input.id}`,
        },
      });

      return `Permission updated for ${input.id}`;
    }),

  deletePermission: protectedProcedure
    .input(
      z.object({
        id: z.bigint(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.permission.delete({
        where: { id },
      });
      await ctx.db.logs.create({
        data: {
          type: "DELETE",
          source: "PERMISSIONS",
          userId: ctx.session.user.id,
          message: `Deleted permission (${id})`,
        },
      });

      return "Permission deleted";
    }),
});
