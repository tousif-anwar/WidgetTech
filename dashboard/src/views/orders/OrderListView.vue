<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import type { OrderStatus } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const store = useOrdersStore()

const statusFilter = ref<OrderStatus | ''>('')

onMounted(() => store.fetchOrders())

function applyFilter() {
  store.fetchOrders({ status: statusFilter.value || undefined })
}

function changePage(page: number) {
  store.fetchOrders({ status: statusFilter.value || undefined, page })
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAYMENT_INITIATED: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  FULFILLED: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-200 text-green-800',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
}

const statuses: OrderStatus[] = [
  'PENDING', 'PAYMENT_INITIATED', 'PAID', 'FULFILLED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
]
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Orders</h1>

    <!-- Filter -->
    <BaseCard>
      <div class="flex items-center gap-3">
        <label class="label mb-0 whitespace-nowrap">Status:</label>
        <select v-model="statusFilter" class="input max-w-xs">
          <option value="">All statuses</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
        <BaseButton variant="secondary" @click="applyFilter">Apply</BaseButton>
      </div>
    </BaseCard>

    <!-- Orders table -->
    <BaseCard>
      <div v-if="store.loading" class="space-y-3">
        <div v-for="n in 10" :key="n" class="h-12 bg-gray-100 rounded animate-pulse" />
      </div>
      <div v-else-if="store.orders.length === 0" class="py-16 text-center text-sm text-gray-500">
        No orders found.
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="order in store.orders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-4 py-4 text-sm font-medium text-gray-900">
                  #{{ order.id.slice(-8).toUpperCase() }}
                </td>
                <td class="px-4 py-4">
                  <p class="text-sm font-medium text-gray-900">{{ order.buyerName }}</p>
                  <p class="text-xs text-gray-500">{{ order.buyerEmail }}</p>
                </td>
                <td class="px-4 py-4">
                  <span :class="['badge', statusColors[order.status] ?? 'bg-gray-100 text-gray-700']">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm font-semibold text-gray-900">${{ order.total.toFixed(2) }}</td>
                <td class="px-4 py-4 text-sm text-gray-500">
                  {{ new Date(order.createdAt).toLocaleDateString() }}
                </td>
                <td class="px-4 py-4 text-right">
                  <BaseButton size="sm" variant="secondary" @click="router.push(`/orders/${order.id}`)">
                    View
                  </BaseButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="store.pagination.totalPages > 1" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p class="text-sm text-gray-600">
            Page {{ store.pagination.page }} of {{ store.pagination.totalPages }}
            ({{ store.pagination.total }} orders)
          </p>
          <div class="flex gap-2">
            <BaseButton size="sm" variant="secondary" :disabled="store.pagination.page <= 1" @click="changePage(store.pagination.page - 1)">Previous</BaseButton>
            <BaseButton size="sm" variant="secondary" :disabled="store.pagination.page >= store.pagination.totalPages" @click="changePage(store.pagination.page + 1)">Next</BaseButton>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
