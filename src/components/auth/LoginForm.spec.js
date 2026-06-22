import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import LoginForm from '@/components/auth/LoginForm.vue'
import { login } from '@/services/auth'

vi.mock('@/services/auth', () => ({
  login: vi.fn(),
}))

async function mountLoginForm() {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Dashboard</div>' } },
      { path: '/register', component: { template: '<div>Register</div>' } },
    ],
  })

  await router.push('/')
  await router.isReady()

  const pushSpy = vi.spyOn(router, 'push')

  const wrapper = mount(LoginForm, {
    global: {
      plugins: [router],
    },
  })

  return { wrapper, pushSpy }
}

async function submitCredentials(wrapper, email = 'user@example.com', password = 'password123') {
  await wrapper.find('input[type="email"]').setValue(email)
  await wrapper.find('input[type="password"]').setValue(password)
  await wrapper.find('form').trigger('submit.prevent')
  await flushPromises()
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits valid credentials to the login service', async () => {
    login.mockResolvedValue({ token: 'test-token' })

    const { wrapper } = await mountLoginForm()
    await submitCredentials(wrapper, 'user@example.com', 'password123')

    expect(login).toHaveBeenCalledOnce()
    expect(login).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    })
    expect(wrapper.find('.general-error').exists()).toBe(false)
  })

  it('shows an error when credentials are invalid', async () => {
    login.mockRejectedValue({
      response: {
        data: {
          message: 'Invalid credentials.',
          errors: {
            email: ['These credentials do not match our records.'],
          },
        },
      },
    })

    const { wrapper, pushSpy } = await mountLoginForm()
    await submitCredentials(wrapper, 'user@example.com', 'wrong-password')

    expect(login).toHaveBeenCalledOnce()
    expect(wrapper.find('.general-error').text()).toBe('Invalid credentials.')
    expect(wrapper.text()).toContain('These credentials do not match our records.')
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('redirects to the dashboard after a successful login', async () => {
    login.mockResolvedValue({ token: 'test-token' })

    const { wrapper, pushSpy } = await mountLoginForm()
    await submitCredentials(wrapper)

    expect(pushSpy).toHaveBeenCalledWith('/')
  })
})
