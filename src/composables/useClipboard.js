import { ref } from 'vue'

export function useClipboard(resetDelay = 2000) {
  const copied = ref(false)
  let timeoutId = null

  async function copy(text) {
    await navigator.clipboard.writeText(text)
    copied.value = true

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      copied.value = false
      timeoutId = null
    }, resetDelay)
  }

  return {
    copied,
    copy,
  }
}
