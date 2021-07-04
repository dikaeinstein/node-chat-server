import { KeyOfLang } from '@/enums/locale'
import makeLocalTranslator from '@/__test__/fixtures/translator'
import TranslationService, { LangNotSupportedError } from '.'

describe('TranslationService', () => {
  test('can translate text', () => {
    const localTranslator = makeLocalTranslator()
    const translationService = new TranslationService(localTranslator)

    const translatedText = translationService.translate({
      source: 'Hello world',
      sourceLang: 'English (British)',
      targetLang: 'German',
    })
    expect(translatedText).toEqual('Hallo Welt!')
  })

  test('can detect sourceLang', () => {
    const localTranslator = makeLocalTranslator()
    const translationService = new TranslationService(localTranslator)

    const translatedText = translationService.translate({
      source: 'Hello world',
      targetLang: 'German',
    })
    expect(translatedText).toEqual('Hallo Welt!')
  })

  test('throws when sourceLang is not supported by translator', () => {
    const localTranslator = makeLocalTranslator({
      isLangSupported: (lang: KeyOfLang) => lang === 'German',
    })
    const translationService = new TranslationService(localTranslator)

    expect(() =>
      translationService.translate({
        source: 'Hello world',
        sourceLang: 'Latvian',
        targetLang: 'German',
      }),
    ).toThrow(
      new LangNotSupportedError(
        `sourceLang Latvian not supported by the translator`,
      ),
    )
  })

  test('throws when targetLang is not supported by translator', () => {
    const localTranslator = makeLocalTranslator({
      isLangSupported: (lang: KeyOfLang) => lang === 'English (British)',
    })
    const translationService = new TranslationService(localTranslator)

    expect(() =>
      translationService.translate({
        source: 'Hello world',
        sourceLang: 'English (British)',
        targetLang: 'Latvian',
      }),
    ).toThrow(
      new LangNotSupportedError(
        `targetLang Latvian not supported by the translator`,
      ),
    )
  })
})
