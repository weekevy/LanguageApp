import type { LanguageCode } from "@linguatube/shared";

export interface ProviderTranslation {
  text: string;
  isMock: boolean;
}

export interface TranslationProvider {
  readonly name: string;
  translate(
    text: string,
    sourceLang: LanguageCode,
    targetLang: LanguageCode,
  ): Promise<ProviderTranslation>;
}
