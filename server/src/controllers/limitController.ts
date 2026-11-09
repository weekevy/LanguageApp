import type { RequestHandler } from "express";
import { successResponse } from "../lib/responses.js";
import { getUsageLimits } from "../services/usageService.js";

export const readLimits: RequestHandler = (request, response) => {
  const identity = request.mockIdentity ?? {
    id: "anonymous-local-device",
    plan: "free" as const,
  };
  response.json(successResponse(getUsageLimits(identity.id, identity.plan)));
};
