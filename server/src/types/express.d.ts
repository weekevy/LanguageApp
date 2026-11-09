import type { SubscriptionPlan } from "@linguatube/shared";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedParams?: unknown;
      mockIdentity?: {
        id: string;
        plan: SubscriptionPlan;
      };
    }
  }
}

export {};
