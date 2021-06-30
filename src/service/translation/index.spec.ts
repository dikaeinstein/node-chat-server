import makeLocalTranslator from '@/__test__/fixtures/translator'
import TranslationService, { AvailableLanguage, LangNotSupportedError } from '.'

describe('TranslationService', () => {
  test('can translate text', () => {
    const localTranslator = makeLocalTranslator()
    const translationService = new TranslationService(localTranslator)

    const translatedText = translationService.translate({
      source: 'Hello world',
      sourceLang: AvailableLanguage.En,
      targetLang: AvailableLanguage.De,
    })
    expect(translatedText).toEqual('Hallo Welt!')
  })

  test('can detect sourceLang', () => {
    const localTranslator = makeLocalTranslator()
    const translationService = new TranslationService(localTranslator)

    const translatedText = translationService.translate({
      source: 'Hello world',
      targetLang: AvailableLanguage.De,
    })
    expect(translatedText).toEqual('Hallo Welt!')
  })

  test('throws when sourceLang is not supported by translator', () => {
    const localTranslator = makeLocalTranslator({
      isLangSupported: (lang: AvailableLanguage) =>
        lang === AvailableLanguage.De || lang === AvailableLanguage.En,
    })
    const translationService = new TranslationService(localTranslator)

    expect(() =>
      translationService.translate({
        source: 'Hello world',
        sourceLang: AvailableLanguage.Lt,
        targetLang: AvailableLanguage.De,
      }),
    ).toThrow(
      new LangNotSupportedError(
        `sourceLang ${AvailableLanguage.Lt} not supported by the translator`,
      ),
    )
  })

  test('throws when targetLang is not supported by translator', () => {
    const localTranslator = makeLocalTranslator({
      isLangSupported: (lang: AvailableLanguage) =>
        lang === AvailableLanguage.De || lang === AvailableLanguage.En,
    })
    const translationService = new TranslationService(localTranslator)

    expect(() =>
      translationService.translate({
        source: 'Hello world',
        sourceLang: AvailableLanguage.En,
        targetLang: AvailableLanguage.Lt,
      }),
    ).toThrow(
      new LangNotSupportedError(
        `targetLang ${AvailableLanguage.Lt} not supported by the translator`,
      ),
    )
  })
})
