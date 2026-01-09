import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { createComment, getAllComments } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  comments: router({
    list: publicProcedure.query(async () => {
      return await getAllComments();
    }),
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(100),
          content: z.string().min(1).max(1000),
          captchaAnswer: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Simple captcha validation (3 + 5 = 8)
        if (input.captchaAnswer !== 8) {
          throw new Error("驗證碼錯誤，請重試");
        }

        await createComment({
          name: input.name,
          content: input.content,
          userId: ctx.user?.id,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
