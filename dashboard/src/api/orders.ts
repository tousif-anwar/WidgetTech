import apiClient from './client'
import type { Order, OrderListParams, PaginatedResponse } from '@/types'

export const ordersApi = {
  async list(params?: OrderListParams): Promise<PaginatedResponse<Order>> {
    const { data } = await apiClient.get<PaginatedResponse<Order>>('/orders', {
      params,
    })
    return data
  },

  async get(id: string): Promise<Order> {
    const { data } = await apiClient.get<Order>(`/orders/${id}`)
    return data
  },

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    const { data } = await apiClient.patch<Order>(`/orders/${id}/status`, { status })
    return data
  },
}
