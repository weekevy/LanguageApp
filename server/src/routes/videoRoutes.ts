import { Router } from "express";
import { parseVideo } from "../controllers/videoController.js";
import { validateBody } from "../middleware/validation.js";
import { parseVideoSchema } from "../validators/videoValidators.js";

export const videoRouter = Router();
videoRouter.post("/parse", validateBody(parseVideoSchema), parseVideo);
