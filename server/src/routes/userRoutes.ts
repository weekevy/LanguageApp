import { Router } from "express";
import { readLimits } from "../controllers/limitController.js";

export const userRouter = Router();
userRouter.get("/limits", readLimits);
