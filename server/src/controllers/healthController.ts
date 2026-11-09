import type { RequestHandler } from "express";
import type { HealthStatus } from "@linguatube/shared";
import { transcriptProvider, translationProvider } from "../providers/index.js";
import { successResponse } from "../lib/responses.js";

export const getHealth: RequestHandler = (_request, response) => {
  const status: HealthStatus = {
    status: "ok",
    service: "linguatube-api",
    timestamp: new Date().toISOString(),
    providers: {
      transcript: transcriptProvider.name,
      translation: translationProvider.name,
    },
  };

  response.json(successResponse(status));
};
