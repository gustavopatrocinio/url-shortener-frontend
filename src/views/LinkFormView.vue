<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import LinkForm from '@/components/links/LinkForm.vue'
import { createLink, fetchLink, updateLink } from '@/services/links'
import { buildLinkPayload, toDatetimeLocalValue } from '@/utils/links'
import { getApiErrorMessage, getApiFieldErrors } from '@/utils/validation'

const route = useRoute()
const router = useRouter()
const linkFormRef = ref(null)

const isLoading = ref(false)
const isSubmitting = ref(false)
const loadError = ref('')
const initialValues = ref({
  originalUrl: '',
  slug: '',
  expiresAt: '',
})

const linkId = computed(() => route.params.id)
const isEditing = computed(() => Boolean(linkId.value))
const pageTitle = computed(() => (isEditing.value ? 'Edit link' : 'Create link'))
const submitLabel = computed(() => (isEditing.value ? 'Update link' : 'Create link'))

async function loadLink() {
  if (!isEditing.value) {
    return
  }

  isLoading.value = true
  loadError.value = ''

  try {
    const link = await fetchLink(linkId.value)
    initialValues.value = {
      originalUrl: link.originalUrl,
      slug: link.slug,
      expiresAt: toDatetimeLocalValue(link.expiresAt),
    }
  } catch (error) {
    loadError.value = getApiErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}

async function handleSubmit(form) {
  isSubmitting.value = true
  linkFormRef.value?.clearErrors()

  const payload = buildLinkPayload(form, { isEditing: isEditing.value })

  try {
    if (isEditing.value) {
      await updateLink(linkId.value, payload)
    } else {
      await createLink(payload)
    }

    await router.push('/')
  } catch (error) {
    linkFormRef.value?.applyApiErrors(getApiFieldErrors(error))
    linkFormRef.value?.setGeneralError(getApiErrorMessage(error))
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadLink)
</script>

<template>
  <main class="link-form-page">
    <header>
      <h1>{{ pageTitle }}</h1>
      <p>
        {{
          isEditing
            ? 'Update the destination, slug, or expiration for this link.'
            : 'Shorten a URL and optionally customize its slug or expiration.'
        }}
      </p>
    </header>

    <p v-if="loadError" class="error">{{ loadError }}</p>
    <p v-else-if="isLoading" class="status">Loading link...</p>

    <LinkForm
      v-else
      ref="linkFormRef"
      :initial-values="initialValues"
      :is-submitting="isSubmitting"
      :submit-label="submitLabel"
      @submit="handleSubmit"
    />
  </main>
</template>

<style scoped>
.link-form-page {
  max-width: 40rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

header {
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0 0 0.25rem;
  font-size: 1.75rem;
}

header p {
  margin: 0;
  color: #64748b;
}

.status {
  margin: 0;
  color: #64748b;
}

.error {
  margin: 0 0 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.875rem;
}
</style>
