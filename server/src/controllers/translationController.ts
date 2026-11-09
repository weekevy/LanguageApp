import type { RequestHandler } from "express";
import type { TranslateInput } from "@linguatube/shared";
import { successResponse } from "../lib/responses.js";
import { translateText } from "../services/translationService.js";

export const translate: RequestHandler = async (request, response) => {
  const input = request.validatedBody as TranslateInput;
  const result = await translateText(
    input.text,
    input.sourceLang,
    input.targetLang,
  );
  response.json(successResponse(result));
};
