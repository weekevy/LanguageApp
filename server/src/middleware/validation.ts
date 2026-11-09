import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export const validateBody = (schema: ZodType): RequestHandler => {
  return (request, _response, next) => {
    request.validatedBody = schema.parse(request.body);
    next();
  };
};

export const validateParams = (schema: ZodType): RequestHandler => {
  return (request, _response, next) => {
    request.validatedParams = schema.parse(request.params);
    next();
  };
};
