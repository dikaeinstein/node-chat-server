import { AxiosInstance } from 'axios'

import { AvailableLanguage, TranslateParams } from '@/service/translation'

interface DeepLTranslation {
  detected_source_language: AvailableLanguage
  text: string
}

interface DeepLResponse {
  translations: DeepLTranslation[]
}

class DeepL {
  constructor(private readonly client: AxiosInstance) {}

  isLangSupported(lang: AvailableLanguage): boolean {
    return true
  }

  async translate(params: TranslateParams): Promise<string> {
    let url = `/translate?text=${params.source}&target=${params.targetLang}`
    if (params.sourceLang !== undefined) {
      url += `source=${params.sourceLang}`
    }

    const { data } = await this.client.get<DeepLResponse>(url)

    return data.translations[0].text
  }
}

export default DeepL
