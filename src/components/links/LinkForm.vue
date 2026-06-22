<script setup>
import { reactive, ref, watch } from 'vue'

import { isValidSlug, isValidUrl } from '@/utils/validation'

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({
      originalUrl: '',
      slug: '',
      expiresAt: '',
    }),
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  submitLabel: {
    type: String,
    default: 'Save link',
  },
})

const emit = defineEmits(['submit'])

const form = reactive({
  originalUrl: '',
  slug: '',
  expiresAt: '',
})

const errors = reactive({
  originalUrl: '',
  slug: '',
  expiresAt: '',
})

const generalError = ref('')

function applyInitialValues(values) {
  form.originalUrl = values.originalUrl ?? ''
  form.slug = values.slug ?? ''
  form.expiresAt = values.expiresAt ?? ''
}

watch(
  () => props.initialValues,
  (values) => {
    applyInitialValues(values)
  },
  { immediate: true, deep: true },
)

function validate() {
  errors.originalUrl = ''
  errors.slug = ''
  errors.expiresAt = ''
  generalError.value = ''

  let isValid = true

  if (!form.originalUrl.trim()) {
    errors.originalUrl = 'Original URL is required.'
    isValid = false
  } else if (!isValidUrl(form.originalUrl.trim())) {
    errors.originalUrl = 'Enter a valid URL.'
    isValid = false
  }

  if (form.slug.trim() && !isValidSlug(form.slug.trim())) {
    errors.slug = 'Slug can only contain letters, numbers, hyphens, and underscores.'
    isValid = false
  }

  return isValid
}

function applyApiErrors(apiErrors) {
  if (apiErrors.original_url?.[0]) {
    errors.originalUrl = apiErrors.original_url[0]
  }

  if (apiErrors.slug?.[0]) {
    errors.slug = apiErrors.slug[0]
  }

  if (apiErrors.expires_at?.[0]) {
    errors.expiresAt = apiErrors.expires_at[0]
  }
}

function handleSubmit() {
  if (!validate()) {
    return
  }

  emit('submit', {
    originalUrl: form.originalUrl,
    slug: form.slug,
    expiresAt: form.expiresAt,
  })
}

defineExpose({
  applyApiErrors,
  setGeneralError(message) {
    generalError.value = message
  },
  clearErrors() {
    errors.originalUrl = ''
    errors.slug = ''
    errors.expiresAt = ''
    generalError.value = ''
  },
})
</script>

<template>
  <form class="link-form" @submit.prevent="handleSubmit">
    <p v-if="generalError" class="general-error">{{ generalError }}</p>

    <label class="field">
      <span>Original URL</span>
      <input
        v-model="form.originalUrl"
        type="url"
        placeholder="https://example.com/very-long-url"
        autocomplete="url"
        :disabled="isSubmitting"
      />
      <span v-if="errors.originalUrl" class="error">{{ errors.originalUrl }}</span>
    </label>

    <label class="field">
      <span>Custom slug <span class="optional">(optional)</span></span>
      <input
        v-model="form.slug"
        type="text"
        placeholder="Leave empty to generate automatically"
        autocomplete="off"
        :disabled="isSubmitting"
      />
      <span v-if="errors.slug" class="error">{{ errors.slug }}</span>
    </label>

    <label class="field">
      <span>Expiration date <span class="optional">(optional)</span></span>
      <input v-model="form.expiresAt" type="datetime-local" :disabled="isSubmitting" />
      <span v-if="errors.expiresAt" class="error">{{ errors.expiresAt }}</span>
    </label>

    <div class="actions">
      <RouterLink class="secondary-button" to="/">Cancel</RouterLink>
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : submitLabel }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.link-form {
  display: flex;
  flex-direction: column;
}

.general-error {
  margin: 0 0 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.875rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.optional {
  color: #94a3b8;
  font-weight: 400;
}

.field input {
  padding: 0.625rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.field input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 1px;
  border-color: #3b82f6;
}

.error {
  color: #b91c1c;
  font-size: 0.8125rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

button,
.secondary-button {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
}

button {
  border: none;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-button {
  display: inline-flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #0f172a;
}
</style>
