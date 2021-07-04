const Lang = [
  'Bulgarian',
  'Czech',
  'Danish',
  'German',
  'Greek',
  'English (British)',
  'English (American)',
  'Spanish',
  'Estonian',
  'Finnish',
  'French',
  'Hungarian',
  'Italian',
  'Japanese',
  'Latvian',
  'Lithuanian',
  'Dutch',
  'Polish',
  'Portuguese',
  'Portuguese (Brazilian)',
  'Romanian',
  'Russian',
  'Slovak',
  'Slovenian',
  'Swedish',
  'Chinese',
]

const loginForm = document.forms.login
const localeSelect = loginForm.locale

const fragment = document.createDocumentFragment()
Lang.forEach((lang, i) => {
  const option = document.createElement('option')
  option.label = lang
  option.value = lang
  option.tabIndex = i + 1

  fragment.appendChild(option)
})
localeSelect.appendChild(fragment)
