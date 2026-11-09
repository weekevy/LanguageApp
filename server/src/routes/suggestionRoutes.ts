import { Router } from "express";
import { listSuggestions } from "../controllers/suggestionController.js";

export const suggestionRouter = Router();
suggestionRouter.get("/", listSuggestions);
