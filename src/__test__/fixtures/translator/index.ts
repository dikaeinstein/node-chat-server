import type { KeyOfLang, Lang } from '@/enums/locale'
import type { Translator, TranslatorParams } from '@/services/translation'

interface Overrides {
  isLangSupported?: (lang: keyof typeof Lang) => boolean
  result?: string
}

const makeLocalTranslator = (overrides: Overrides = {}): Translator => {
  return {
    isLangSupported(lang: KeyOfLang): boolean {
      if (overrides.isLangSupported != null) {
        return overrides.isLangSupported(lang)
      }

      return true
    },
    translate(params: TranslatorParams): string {
      return overrides.result ?? 'Hallo Welt!'
    },
  }
}

export default makeLocalTranslator
