import type { LanguageCode } from "@linguatube/shared";
import { AppError } from "../../lib/errors.js";
import type {
  ProviderTranslation,
  TranslationProvider,
} from "./TranslationProvider.js";

export class RealTranslationProvider implements TranslationProvider {
  readonly name = "real-unconfigured";

  async translate(
    _text: string,
    _sourceLang: LanguageCode,
    _targetLang: LanguageCode,
  ): Promise<ProviderTranslation> {
    throw new AppError(
      503,
      "TRANSLATION_PROVIDER_UNAVAILABLE",
      "A real translation provider has not been configured. Switch TRANSLATION_PROVIDER to mock or add provider credentials.",
    );
  }
}
