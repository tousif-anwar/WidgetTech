import apiClient from './client'
import type {
  AnalyticsSummary,
  RevenueDataPoint,
  TopProduct,
  ConversionFunnel,
  AnalyticsDateRange,
} from '@/types'

export const analyticsApi = {
  async getSummary(range: AnalyticsDateRange): Promise<AnalyticsSummary> {
    const { data } = await apiClient.get<AnalyticsSummary>('/analytics/summary', {
      params: range,
    })
    return data
  },

  async getRevenueSeries(range: AnalyticsDateRange): Promise<RevenueDataPoint[]> {
    const { data } = await apiClient.get<RevenueDataPoint[]>('/analytics/revenue', {
      params: range,
    })
    return data
  },

  async getTopProducts(range: AnalyticsDateRange, limit = 5): Promise<TopProduct[]> {
    const { data } = await apiClient.get<TopProduct[]>('/analytics/top-products', {
      params: { ...range, limit },
    })
    return data
  },

  async getConversionFunnel(range: AnalyticsDateRange): Promise<ConversionFunnel> {
    const { data } = await apiClient.get<ConversionFunnel>('/analytics/funnel', {
      params: range,
    })
    return data
  },
}
