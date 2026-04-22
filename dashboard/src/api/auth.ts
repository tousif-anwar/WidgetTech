import apiClient from './client'
import type { User, LoginRequest, RegisterRequest, AuthTokens } from '@/types'

export const authApi = {
  async login(payload: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await apiClient.post<{ user: User; tokens: AuthTokens }>(
      '/auth/login',
      payload,
    )
    return data
  },

  async register(payload: RegisterRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await apiClient.post<{ user: User; tokens: AuthTokens }>(
      '/auth/register',
      payload,
    )
    return data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async getMe(): Promise<User> {
    const { data } = await apiClient.get<User>('/auth/me')
    return data
  },

  async refresh(): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthTokens>('/auth/refresh')
    return data
  },
}
