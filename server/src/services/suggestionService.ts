import type { VideoMetadata } from "@linguatube/shared";
import { mockSuggestions } from "../providers/mockData.js";

export const getSuggestions = (): VideoMetadata[] => mockSuggestions;
