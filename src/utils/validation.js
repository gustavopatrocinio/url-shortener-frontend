const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value)
}

export function getApiErrorMessage(error) {
  return error.response?.data?.message ?? 'Something went wrong. Please try again.'
}

export function getApiFieldErrors(error) {
  return error.response?.data?.errors ?? {}
}

export function isValidUrl(value) {
  try {
    const url = value.includes('://') ? value : `https://${value}`
    const parsed = new URL(url)

    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/

export function isValidSlug(value) {
  return SLUG_PATTERN.test(value)
}
