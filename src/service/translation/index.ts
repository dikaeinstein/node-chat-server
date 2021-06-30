export interface TranslateParams {
  source: string
  targetLang: AvailableLanguage
  sourceLang?: AvailableLanguage
}

export interface Translator {
  isLangSupported: (lang: AvailableLanguage) => boolean
  translate: (params: TranslateParams) => string | Promise<string>
}

export class LangNotSupportedError extends Error {}

export enum AvailableLanguage {
  Bg = 'BG', // Bulgarian
  Cs = 'CS', // Czech
  Da = 'DA', // Danish
  De = 'DE', // German
  EL = 'EL', // Greek
  EnGB = 'EN-GB', // English (British)
  EnUS = 'EN-US', // English (American),
  En = 'EN', // English (unspecified variant for backward compatibility; please select EN-GB or EN-US instead)',
  Es = 'ES', // Spanish
  Et = 'ET', // Estonian
  Fi = 'FI', // Finnish
  Fr = 'FR', // French
  Hu = 'HU', // Hungarian
  It = 'IT', // Italian
  Ja = 'JA', // Japanese
  Lt = 'LT', // Lithuanian
  Lv = 'LV', // Latvian
  Nl = 'NL', // Dutch
  Pl = 'PL', // Polish
  PtPT = 'PT-PT', // Portuguese (all Portuguese varieties excluding Brazilian Portuguese)
  PtBR = 'PT-BR', // Portuguese (Brazilian)
  Pt = 'PT', // Portuguese (unspecified variant for backward compatibility; please select PT-PT or PT-BR instead)
  Ro = 'RO', // Romanian
  Ru = 'RU', // Russian
  Sk = 'SK', // Slovak
  Sl = 'SL', // Slovenian
  Sv = 'SV', // Swedish
  Zh = 'ZH', // Chinese
}

class TranslationService {
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

    return this.translator.translate({ source, targetLang, sourceLang })
  }
}

export default TranslationService
