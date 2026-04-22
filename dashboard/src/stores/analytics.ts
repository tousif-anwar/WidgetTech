import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  AnalyticsSummary,
  RevenueDataPoint,
  TopProduct,
  ConversionFunnel,
  AnalyticsDateRange,
} from '@/types'
import { analyticsApi } from '@/api/analytics'

export const useAnalyticsStore = defineStore('analytics', () => {
  const summary = ref<AnalyticsSummary | null>(null)
  const revenueSeries = ref<RevenueDataPoint[]>([])
  const topProducts = ref<TopProduct[]>([])
  const funnel = ref<ConversionFunnel | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(range: AnalyticsDateRange) {
    loading.value = true
    error.value = null
    try {
      const [sum, series, top, conv] = await Promise.all([
        analyticsApi.getSummary(range),
        analyticsApi.getRevenueSeries(range),
        analyticsApi.getTopProducts(range),
        analyticsApi.getConversionFunnel(range),
      ])
      summary.value = sum
      revenueSeries.value = series
      topProducts.value = top
      funnel.value = conv
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
    } finally {
      loading.value = false
    }
  }

  return { summary, revenueSeries, topProducts, funnel, loading, error, fetchAll }
})
