import { Router } from "express";
import { translate } from "../controllers/translationController.js";
import { validateBody } from "../middleware/validation.js";
import { translateSchema } from "../validators/translationValidators.js";

export const translationRouter = Router();
translationRouter.post("/", validateBody(translateSchema), translate);
