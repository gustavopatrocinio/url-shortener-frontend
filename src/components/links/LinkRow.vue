<script setup>
import { computed } from 'vue'

import { useClipboard } from '@/composables/useClipboard'
import { buildShortUrl, formatExpiresAt, truncateUrl } from '@/utils/links'

const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
  baseUrl: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['delete'])

const { copied, copy } = useClipboard()

const shortUrl = computed(() => buildShortUrl(props.link, props.baseUrl))
const truncatedOriginalUrl = computed(() => truncateUrl(props.link.originalUrl))
const expirationLabel = computed(() => formatExpiresAt(props.link.expiresAt))

async function handleCopy() {
  await copy(shortUrl.value)
}
</script>

<template>
  <tr>
    <td class="original-url" :title="link.originalUrl">
      {{ truncatedOriginalUrl }}
    </td>
    <td>
      <code>{{ link.slug }}</code>
    </td>
    <td>
      <a :href="shortUrl" target="_blank" rel="noopener noreferrer">{{ shortUrl }}</a>
    </td>
    <td class="numeric">{{ link.clicks }}</td>
    <td>{{ expirationLabel ?? '—' }}</td>
    <td class="actions">
      <button type="button" class="ghost" @click="handleCopy">
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
      <RouterLink class="ghost link-button" :to="{ name: 'link-edit', params: { id: link.id } }">
        Edit
      </RouterLink>
      <button type="button" class="ghost danger" @click="emit('delete', link)">Delete</button>
    </td>
  </tr>
</template>

<style scoped>
.original-url {
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

code {
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: #f1f5f9;
  font-size: 0.8125rem;
}

a {
  color: #2563eb;
  text-decoration: none;
  word-break: break-all;
}

.numeric {
  text-align: right;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  white-space: nowrap;
}

.ghost {
  padding: 0.375rem 0.625rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
  color: #0f172a;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.ghost.danger {
  border-color: #fecaca;
  color: #b91c1c;
}

.link-button {
  display: inline-flex;
  align-items: center;
}
</style>
