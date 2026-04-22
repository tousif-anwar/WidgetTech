<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import RevenueChart from '@/components/charts/RevenueChart.vue'
import ConversionChart from '@/components/charts/ConversionChart.vue'

const analytics = useAnalyticsStore()

const from = ref('')
const to = ref('')

function initRange(days: number) {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  from.value = start.toISOString().split('T')[0]
  to.value = end.toISOString().split('T')[0]
}

onMounted(() => {
  initRange(30)
  analytics.fetchAll({ from: from.value, to: to.value })
})

function applyRange() {
  analytics.fetchAll({ from: from.value, to: to.value })
}

function quickRange(days: number) {
  initRange(days)
  analytics.fetchAll({ from: from.value, to: to.value })
}

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>

      <!-- Date range controls -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex gap-1">
          <BaseButton size="sm" variant="secondary" @click="quickRange(7)">7d</BaseButton>
          <BaseButton size="sm" variant="secondary" @click="quickRange(30)">30d</BaseButton>
          <BaseButton size="sm" variant="secondary" @click="quickRange(90)">90d</BaseButton>
        </div>
        <input v-model="from" type="date" class="input w-36" />
        <span class="text-gray-400">→</span>
        <input v-model="to" type="date" class="input w-36" />
        <BaseButton size="sm" variant="primary" @click="applyRange">Apply</BaseButton>
      </div>
    </div>

    <!-- Summary KPIs -->
    <div v-if="analytics.loading" class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="n in 4" :key="n" class="card animate-pulse h-24" />
    </div>
    <div v-else-if="analytics.summary" class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <BaseCard>
        <p class="text-sm text-gray-500">Total Revenue</p>
        <p class="text-2xl font-bold mt-1">${{ fmt(analytics.summary.totalRevenue) }}</p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm text-gray-500">Total Orders</p>
        <p class="text-2xl font-bold mt-1">{{ analytics.summary.totalOrders.toLocaleString() }}</p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm text-gray-500">Avg. Order Value</p>
        <p class="text-2xl font-bold mt-1">${{ fmt(analytics.summary.averageOrderValue) }}</p>
      </BaseCard>
      <BaseCard>
        <p class="text-sm text-gray-500">Conversion Rate</p>
        <p class="text-2xl font-bold mt-1">{{ (analytics.summary.conversionRate * 100).toFixed(1) }}%</p>
      </BaseCard>
    </div>

    <!-- Revenue chart -->
    <BaseCard title="Revenue Over Time">
      <div v-if="analytics.loading" class="h-64 bg-gray-100 rounded animate-pulse" />
      <RevenueChart v-else-if="analytics.revenueSeries.length" :data="analytics.revenueSeries" />
      <p v-else class="text-sm text-gray-500 py-8 text-center">No data for the selected period.</p>
    </BaseCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Conversion funnel -->
      <BaseCard title="Conversion Funnel">
        <div v-if="analytics.loading" class="h-56 bg-gray-100 rounded animate-pulse" />
        <ConversionChart v-else-if="analytics.funnel" :funnel="analytics.funnel" />
        <p v-else class="text-sm text-gray-500 py-8 text-center">No funnel data available.</p>
      </BaseCard>

      <!-- Top products -->
      <BaseCard title="Top Products">
        <div v-if="analytics.loading" class="space-y-3">
          <div v-for="n in 5" :key="n" class="h-10 bg-gray-100 rounded animate-pulse" />
        </div>
        <div v-else-if="analytics.topProducts.length === 0" class="py-8 text-center text-sm text-gray-500">
          No product data available.
        </div>
        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="(product, idx) in analytics.topProducts"
            :key="product.productId"
            class="flex items-center gap-3 py-3"
          >
            <span class="text-xs font-bold text-gray-400 w-4">{{ idx + 1 }}</span>
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.productName"
              class="h-10 w-10 rounded-lg object-cover shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ product.productName }}</p>
              <p class="text-xs text-gray-500">{{ product.unitsSold }} sold</p>
            </div>
            <p class="text-sm font-semibold text-gray-900">${{ fmt(product.totalRevenue) }}</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
