import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const logsRouter = createTRPCRouter({
  fetchAll: publicProcedure.query(async ({ ctx }) => {
    const logs = await ctx.db.logs.findMany({
      include: {
        User_Logs_userIdToUser: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return logs;
  }),

  deleteLogs: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.logs.delete({
        where: { id: BigInt(id) },
      });

      return "Logs deleted ";
    }),
});
