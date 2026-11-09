import { parseVideoSchema, youtubeVideoIdSchema } from "@linguatube/shared";
import { z } from "zod";

export { parseVideoSchema };

export const videoIdParamsSchema = z.object({
  videoId: youtubeVideoIdSchema,
});

export type VideoIdParams = z.infer<typeof videoIdParamsSchema>;
