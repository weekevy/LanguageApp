import { rateLimit } from "express-rate-limit";
import { errorResponse } from "../lib/responses.js";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1_000,
  limit: 180,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_request, response) => {
    response
      .status(429)
      .json(errorResponse("RATE_LIMITED", "Too many requests. Please try again shortly."));
  },
});
