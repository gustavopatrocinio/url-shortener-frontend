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
