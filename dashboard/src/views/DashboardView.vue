<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { useOrdersStore } from '@/stores/orders'
import BaseCard from '@/components/ui/BaseCard.vue'
import RevenueChart from '@/components/charts/RevenueChart.vue'

const analytics = useAnalyticsStore()
const orders = useOrdersStore()

const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(today.getDate() - 30)

const range = {
  from: thirtyDaysAgo.toISOString().split('T')[0],
  to: today.toISOString().split('T')[0],
}

onMounted(async () => {
  await Promise.all([analytics.fetchAll(range), orders.fetchOrders({ limit: 5 })])
})

const statCards = computed(() => {
  if (!analytics.summary) return []
  const s = analytics.summary
  return [
    {
      label: 'Total Revenue',
      value: `$${s.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: s.revenueChange,
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      label: 'Total Orders',
      value: s.totalOrders.toLocaleString(),
      change: s.ordersChange,
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
      label: 'Avg. Order Value',
      value: `$${s.averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: null,
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    },
    {
      label: 'Conversion Rate',
      value: `${(s.conversionRate * 100).toFixed(1)}%`,
      change: null,
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    },
  ]
})

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
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>

    <!-- Stat cards -->
    <div v-if="analytics.loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="n in 4" :key="n" class="card animate-pulse h-28" />
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <BaseCard v-for="card in statCards" :key="card.label">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ card.label }}</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ card.value }}</p>
            <p
              v-if="card.change !== null"
              :class="[
                'text-xs font-medium mt-1',
                (card.change ?? 0) >= 0 ? 'text-green-600' : 'text-red-600',
              ]"
            >
              {{ (card.change ?? 0) >= 0 ? '▲' : '▼' }}
              {{ Math.abs((card.change ?? 0) * 100).toFixed(1) }}% vs last 30 days
            </p>
          </div>
          <div class="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="card.icon" />
            </svg>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Revenue chart -->
    <BaseCard title="Revenue — last 30 days">
      <div v-if="analytics.loading" class="h-64 bg-gray-100 rounded-lg animate-pulse" />
      <RevenueChart v-else-if="analytics.revenueSeries.length" :data="analytics.revenueSeries" />
      <p v-else class="text-sm text-gray-500 py-8 text-center">No revenue data available.</p>
    </BaseCard>

    <!-- Recent orders -->
    <BaseCard title="Recent Orders">
      <div v-if="orders.loading" class="space-y-3">
        <div v-for="n in 5" :key="n" class="h-10 bg-gray-100 rounded animate-pulse" />
      </div>
      <div v-else-if="orders.orders.length === 0" class="py-8 text-center text-sm text-gray-500">
        No orders yet.
      </div>
      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="order in orders.orders"
          :key="order.id"
          class="flex items-center justify-between py-3"
        >
          <div>
            <p class="text-sm font-medium text-gray-900">#{{ order.id.slice(-8).toUpperCase() }}</p>
            <p class="text-xs text-gray-500">{{ order.buyerName }} · {{ order.buyerEmail }}</p>
          </div>
          <div class="flex items-center gap-4">
            <span :class="['badge', statusColors[order.status] ?? 'bg-gray-100 text-gray-700']">
              {{ order.status }}
            </span>
            <span class="text-sm font-semibold text-gray-900">
              ${{ order.total.toFixed(2) }}
            </span>
          </div>
        </div>
      </div>
      <div class="mt-4 text-right">
        <RouterLink to="/orders" class="text-sm text-primary-600 hover:underline">
          View all orders →
        </RouterLink>
      </div>
    </BaseCard>
  </div>
</template>
