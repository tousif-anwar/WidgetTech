import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isSeller = computed(() => user.value?.role === 'seller' || user.value?.role === 'admin')

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const result = await authApi.login({ email, password })
      accessToken.value = result.tokens.accessToken
      localStorage.setItem('access_token', result.tokens.accessToken)
      user.value = result.user
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const result = await authApi.register({ name, email, password })
      accessToken.value = result.tokens.accessToken
      localStorage.setItem('access_token', result.tokens.accessToken)
      user.value = result.user
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      user.value = null
      accessToken.value = null
      localStorage.removeItem('access_token')
    }
  }

  async function fetchMe() {
    if (!accessToken.value) return
    try {
      user.value = await authApi.getMe()
    } catch {
      user.value = null
      accessToken.value = null
      localStorage.removeItem('access_token')
    }
  }

  return { user, accessToken, loading, error, isAuthenticated, isSeller, login, register, logout, fetchMe }
})
