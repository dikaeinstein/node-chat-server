import type {
  AvailableLanguage,
  TranslateParams,
  Translator,
} from '@/service/translation'

interface Overrides {
  isLangSupported?: (lang: AvailableLanguage) => boolean
  result?: string
}

const makeLocalTranslator = (overrides: Overrides = {}): Translator => {
  return {
    isLangSupported(lang: AvailableLanguage): boolean {
      if (overrides.isLangSupported !== undefined) {
        return overrides.isLangSupported(lang)
      }

      return true
    },
    translate(params: TranslateParams): string {
      return overrides.result ?? 'Hallo Welt!'
    },
  }
}

export default makeLocalTranslator
