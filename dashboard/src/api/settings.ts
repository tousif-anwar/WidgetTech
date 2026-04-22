import apiClient from './client'
import type { StoreSettings } from '@/types'

export const settingsApi = {
  async get(): Promise<StoreSettings> {
    const { data } = await apiClient.get<StoreSettings>('/settings')
    return data
  },

  async update(payload: Partial<StoreSettings>): Promise<StoreSettings> {
    const { data } = await apiClient.patch<StoreSettings>('/settings', payload)
    return data
  },

  async getStripeConnectUrl(): Promise<{ url: string }> {
    const { data } = await apiClient.get<{ url: string }>('/payments/connect/onboard')
    return data
  },

  async getStripeConnectStatus(): Promise<{ status: StoreSettings['stripeConnectStatus'] }> {
    const { data } = await apiClient.get<{ status: StoreSettings['stripeConnectStatus'] }>(
      '/payments/connect/status',
    )
    return data
  },
}
