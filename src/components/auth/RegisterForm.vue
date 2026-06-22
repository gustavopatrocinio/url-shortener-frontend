<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { extractToken, register, saveToken } from '@/services/auth'
import { getApiErrorMessage, getApiFieldErrors, isValidEmail } from '@/utils/validation'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const generalError = ref('')
const isSubmitting = ref(false)

function validate() {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.password_confirmation = ''
  generalError.value = ''

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Name is required.'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.'
    isValid = false
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Enter a valid email address.'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required.'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
    isValid = false
  }

  if (!form.password_confirmation) {
    errors.password_confirmation = 'Please confirm your password.'
    isValid = false
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match.'
    isValid = false
  }

  return isValid
}

function applyApiErrors(apiErrors) {
  for (const field of Object.keys(errors)) {
    if (apiErrors[field]?.[0]) {
      errors[field] = apiErrors[field][0]
    }
  }
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  isSubmitting.value = true
  generalError.value = ''

  try {
    const data = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      password_confirmation: form.password_confirmation,
    })

    const token = extractToken(data)

    if (token) {
      saveToken(token)
      await router.push('/')
      return
    }

    await router.push('/login')
  } catch (error) {
    applyApiErrors(getApiFieldErrors(error))
    generalError.value = getApiErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <h1>Create account</h1>
    <p class="subtitle">Start shortening and tracking your links.</p>

    <p v-if="generalError" class="general-error">{{ generalError }}</p>

    <label class="field">
      <span>Name</span>
      <input v-model="form.name" type="text" autocomplete="name" :disabled="isSubmitting" />
      <span v-if="errors.name" class="error">{{ errors.name }}</span>
    </label>

    <label class="field">
      <span>Email</span>
      <input v-model="form.email" type="email" autocomplete="email" :disabled="isSubmitting" />
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </label>

    <label class="field">
      <span>Password</span>
      <input
        v-model="form.password"
        type="password"
        autocomplete="new-password"
        :disabled="isSubmitting"
      />
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </label>

    <label class="field">
      <span>Confirm password</span>
      <input
        v-model="form.password_confirmation"
        type="password"
        autocomplete="new-password"
        :disabled="isSubmitting"
      />
      <span v-if="errors.password_confirmation" class="error">{{ errors.password_confirmation }}</span>
    </label>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Creating account...' : 'Create account' }}
    </button>

    <p class="footer">
      Already have an account?
      <RouterLink to="/login">Sign in</RouterLink>
    </p>
  </form>
</template>

<style scoped>
.auth-form h1 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.subtitle {
  margin: 0 0 1.5rem;
  color: #64748b;
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

button {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.footer {
  margin: 1.25rem 0 0;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
}

.footer a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}
</style>
