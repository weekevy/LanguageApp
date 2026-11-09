import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  name: "linguatube-api",
  level: env.NODE_ENV === "test" ? "silent" : env.LOG_LEVEL,
  base: {
    service: "linguatube-api",
    environment: env.NODE_ENV,
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "token",
    ],
    censor: "[redacted]",
  },
});
