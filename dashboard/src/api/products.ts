import apiClient from './client'
import type {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductSearchParams,
  PaginatedResponse,
} from '@/types'

export const productsApi = {
  async list(params?: ProductSearchParams): Promise<PaginatedResponse<Product>> {
    const { data } = await apiClient.get<PaginatedResponse<Product>>('/products', {
      params,
    })
    return data
  },

  async get(id: string): Promise<Product> {
    const { data } = await apiClient.get<Product>(`/products/${id}`)
    return data
  },

  async create(payload: ProductCreateRequest): Promise<Product> {
    const { data } = await apiClient.post<Product>('/products', payload)
    return data
  },

  async update(id: string, payload: ProductUpdateRequest): Promise<Product> {
    const { data } = await apiClient.patch<Product>(`/products/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`)
  },

  async uploadImage(id: string, file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await apiClient.post<{ imageUrl: string }>(
      `/products/${id}/images`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return data
  },
}
