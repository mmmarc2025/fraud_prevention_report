import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(user?: AuthenticatedUser): TrpcContext {
  const ctx: TrpcContext = {
    user: user || undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("comments router", () => {
  it("should reject comment with wrong captcha answer", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.comments.create({
        name: "Test User",
        content: "This is a test comment",
        captchaAnswer: 7, // Wrong answer (correct is 8)
      })
    ).rejects.toThrow("驗證碼錯誤，請重試");
  });

  it("should accept comment with correct captcha answer", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.comments.create({
      name: "Test User",
      content: "This is a test comment",
      captchaAnswer: 8, // Correct answer
    });

    expect(result).toEqual({ success: true });
  });

  it("should list all comments", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const comments = await caller.comments.list();

    expect(Array.isArray(comments)).toBe(true);
  });
});
