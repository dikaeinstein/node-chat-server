export enum Lang {
  Bulgarian = 'BG',
  Czech = 'CS',
  Danish = 'DA',
  German = 'DE',
  Greek = 'EL',
  'English (British)' = 'EN-GB',
  'English (American)' = 'EN-US',
  Spanish = 'ES',
  Estonian = 'ET',
  Finnish = 'FI',
  French = 'FR',
  Hungarian = 'HU',
  Italian = 'IT',
  Japanese = 'JA',
  Lithuanian = 'LT',
  Latvian = 'LV',
  Dutch = 'NL',
  Polish = 'PL',
  Portuguese = 'PT-PT', // All Portuguese varieties excluding Brazilian Portuguese
  'Portuguese (Brazilian)' = 'PT-BR',
  Romanian = 'RO',
  Russian = 'RU',
  Slovak = 'SK',
  Slovenian = 'SL',
  Swedish = 'SV',
  Chinese = 'ZH',
}

export type KeyOfLang = keyof typeof Lang
export type Locale = `${Lang}`
