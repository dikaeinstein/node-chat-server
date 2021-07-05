import assert from 'assert'

import type { AxiosInstance } from 'axios'
import type { Logger } from 'pino'

import { KeyOfLang, Lang } from '@/enums/locale'
import type { Translator, TranslatorParams } from '@/services/translation'

interface DeepLTranslation {
  detected_source_language: string
  text: string
}

interface DeepLResponse {
  translations: DeepLTranslation[]
}

interface DeepLConfig {
  DEEPL_AUTH_KEY: string
}

class DeepL implements Translator {
  constructor(
    private readonly config: DeepLConfig,
    private readonly client: AxiosInstance,
    private readonly logger: Logger,
  ) {
    assert(config.DEEPL_AUTH_KEY, 'DEEPL_AUTH_KEY must be specified')
  }

  isLangSupported(lang: KeyOfLang): boolean {
    const foundLocale = Lang[lang]
    return foundLocale !== undefined
  }

  async translate(params: TranslatorParams): Promise<string> {
    try {
      let url = `/translate?auth_key=${this.config.DEEPL_AUTH_KEY}&text=${params.source}&target_lang=${params.targetLang}`
      if (params.sourceLang != null) {
        url += `source_lang=${params.sourceLang}`
      }

      const { data } = await this.client.get<DeepLResponse>(url)

      return data.translations[0].text
    } catch (error) {
      if (error.response != null) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { data } = error.response ?? {}
        if (data.message != null) {
          this.logger.error(error.config, data.message)
        } else {
          this.logger.debug(error.config)
        }
      } else if (error.request != null) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        this.logger.error(error.request, 'Request error')
      }

      throw error
    }
  }
}

export default DeepL
