import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type { ApiError } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send HttpOnly refresh-token cookie
})

// Attach JWT access token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — attempt token refresh then retry once
let isRefreshing = false
let pendingQueue: Array<(token: string) => void> = []

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve) => {
          pendingQueue.push(resolve)
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return apiClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post<{ accessToken: string }>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        )
        const newToken = data.accessToken
        localStorage.setItem('access_token', newToken)
        pendingQueue.forEach((cb) => cb(newToken))
        pendingQueue = []
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        return apiClient(originalRequest)
      } catch {
        localStorage.removeItem('access_token')
        pendingQueue = []
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    const apiError: ApiError = {
      message:
        (error.response?.data as Record<string, string>)?.message ??
        error.message ??
        'An unexpected error occurred',
      code: (error.response?.data as Record<string, string>)?.code,
      statusCode: error.response?.status ?? 0,
    }
    return Promise.reject(apiError)
  },
)

export default apiClient
