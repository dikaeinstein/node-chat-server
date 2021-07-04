import { KeyOfLang, Lang, Locale } from '@/enums/locale'
import type { ITranslationService, TranslateParams } from '@/services/chat'

export interface TranslatorParams {
  source: string
  targetLang: Locale
  sourceLang?: Locale
}

export interface Translator {
  isLangSupported: (lang: KeyOfLang) => boolean
  translate: (params: TranslatorParams) => string | Promise<string>
}

export class LangNotSupportedError extends Error {}

class TranslationService implements ITranslationService {
  constructor(private readonly translator: Translator) {}

  translate({
    source,
    targetLang,
    sourceLang,
  }: TranslateParams): string | Promise<string> {
    const isTargetLangSupported = this.translator.isLangSupported(targetLang)
    if (!isTargetLangSupported) {
      throw new LangNotSupportedError(
        `targetLang ${targetLang} not supported by the translator`,
      )
    }

    if (
      sourceLang !== undefined &&
      !this.translator.isLangSupported(sourceLang)
    ) {
      throw new LangNotSupportedError(
        `sourceLang ${sourceLang} not supported by the translator`,
      )
    }

    return this.translator.translate({
      source,
      targetLang: Lang[targetLang],
      ...(sourceLang !== undefined ? { sourceLang: Lang[sourceLang] } : {}),
    })
  }
}

export default TranslationService
