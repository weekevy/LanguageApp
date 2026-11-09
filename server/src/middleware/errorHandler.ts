import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import { errorResponse } from "../lib/responses.js";

export const notFoundHandler: RequestHandler = (request, response) => {
  response
    .status(404)
    .json(errorResponse("NOT_FOUND", `Route ${request.method} ${request.path} was not found.`));
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  request,
  response,
  _next,
) => {
  if (error instanceof ZodError) {
    response.status(400).json(
      errorResponse("VALIDATION_ERROR", "The request contains invalid data.", {
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      }),
    );
    return;
  }

  if (error instanceof AppError) {
    response
      .status(error.statusCode)
      .json(errorResponse(error.code, error.message, error.details));
    return;
  }

  logger.error(
    {
      error,
      method: request.method,
      path: request.path,
    },
    "Unhandled request error",
  );

  response
    .status(500)
    .json(errorResponse("INTERNAL_ERROR", "An unexpected server error occurred."));
};
