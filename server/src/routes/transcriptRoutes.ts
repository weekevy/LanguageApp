import { Router } from "express";
import { readTranscript } from "../controllers/transcriptController.js";
import { validateParams } from "../middleware/validation.js";
import { videoIdParamsSchema } from "../validators/videoValidators.js";

export const transcriptRouter = Router();
transcriptRouter.get("/:videoId", validateParams(videoIdParamsSchema), readTranscript);
