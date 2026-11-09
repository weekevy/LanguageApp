import type { RequestHandler } from "express";
import { successResponse } from "../lib/responses.js";
import { getSuggestions } from "../services/suggestionService.js";

export const listSuggestions: RequestHandler = (_request, response) => {
  response.json(successResponse({ videos: getSuggestions() }));
};
