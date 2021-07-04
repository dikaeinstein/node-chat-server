const INTERNAL_MODULES_REGEX = /\(internal\//i
const EXTERNAL_MODULES_REGEX = /\/node_modules\//i

/* Formats a stack trace to only include user code */
const justMyCode = (stack: string): string[] => {
  return stack
    .split(/[\r\n]/gi)
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .filter(
      (line) =>
        !INTERNAL_MODULES_REGEX.test(line) &&
        !EXTERNAL_MODULES_REGEX.test(line),
    )
}

export default justMyCode
