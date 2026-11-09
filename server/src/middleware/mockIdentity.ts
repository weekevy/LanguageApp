import type { RequestHandler } from "express";

const safeIdentity = (value: string | undefined) =>
  value?.trim().replace(/[^a-zA-Z0-9@._-]/g, "").slice(0, 120);

export const attachMockIdentity: RequestHandler = (request, _response, next) => {
  const userId = safeIdentity(request.header("x-mock-user-id"));
  const deviceId = safeIdentity(request.header("x-device-id"));
  const plan = request.header("x-mock-plan") === "pro" ? "pro" : "free";

  request.mockIdentity = {
    id: userId || deviceId || "anonymous-local-device",
    plan,
  };

  next();
};
