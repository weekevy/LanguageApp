import type {
  LanguageCode,
  TranslationResult,
} from "@linguatube/shared";
import { translationProvider } from "../providers/index.js";
import { MemoryCacheService } from "./cache/CacheService.js";

const cache = new MemoryCacheService();
const CACHE_TTL_SECONDS = 24 * 60 * 60;

const createCacheKey = (
  text: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
) => `${translationProvider.name}:${sourceLang}:${targetLang}:${text.trim().toLocaleLowerCase()}`;

export const translateText = async (
  text: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
): Promise<TranslationResult> => {
  const key = createCacheKey(text, sourceLang, targetLang);
  const cached = await cache.get<Omit<TranslationResult, "cached">>(key);

  if (cached) {
    return { ...cached, cached: true };
  }

  const result = await translationProvider.translate(text, sourceLang, targetLang);
  const value: Omit<TranslationResult, "cached"> = {
    translated: result.text,
    sourceLang,
    targetLang,
    isMock: result.isMock,
  };

  await cache.set(key, value, CACHE_TTL_SECONDS);

  return { ...value, cached: false };
};

export const clearTranslationCache = () => cache.clear();
