import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order, OrderListParams, PaginatedResponse } from '@/types'
import { ordersApi } from '@/api/orders'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const pagination = ref<Omit<PaginatedResponse<Order>, 'data'>>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchOrders(params?: OrderListParams) {
    loading.value = true
    error.value = null
    try {
      const result = await ordersApi.list(params)
      orders.value = result.data
      pagination.value = { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages }
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
    } finally {
      loading.value = false
    }
  }

  async function fetchOrder(id: string) {
    loading.value = true
    error.value = null
    try {
      currentOrder.value = await ordersApi.get(id)
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
    } finally {
      loading.value = false
    }
  }

  async function updateOrderStatus(id: string, status: Order['status']) {
    loading.value = true
    error.value = null
    try {
      const updated = await ordersApi.updateStatus(id, status)
      const idx = orders.value.findIndex((o) => o.id === id)
      if (idx !== -1) orders.value[idx] = updated
      if (currentOrder.value?.id === id) currentOrder.value = updated
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
      throw err
    } finally {
      loading.value = false
    }
  }

  return { orders, currentOrder, pagination, loading, error, fetchOrders, fetchOrder, updateOrderStatus }
})
