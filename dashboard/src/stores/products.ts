import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, ProductCreateRequest, ProductUpdateRequest, ProductSearchParams, PaginatedResponse } from '@/types'
import { productsApi } from '@/api/products'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const pagination = ref<Omit<PaginatedResponse<Product>, 'data'>>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProducts(params?: ProductSearchParams) {
    loading.value = true
    error.value = null
    try {
      const result = await productsApi.list(params)
      products.value = result.data
      pagination.value = { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages }
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id: string) {
    loading.value = true
    error.value = null
    try {
      currentProduct.value = await productsApi.get(id)
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
    } finally {
      loading.value = false
    }
  }

  async function createProduct(payload: ProductCreateRequest): Promise<Product> {
    loading.value = true
    error.value = null
    try {
      const product = await productsApi.create(payload)
      products.value.unshift(product)
      return product
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(id: string, payload: ProductUpdateRequest): Promise<Product> {
    loading.value = true
    error.value = null
    try {
      const updated = await productsApi.update(id, payload)
      const idx = products.value.findIndex((p) => p.id === id)
      if (idx !== -1) products.value[idx] = updated
      if (currentProduct.value?.id === id) currentProduct.value = updated
      return updated
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(id: string) {
    loading.value = true
    error.value = null
    try {
      await productsApi.delete(id)
      products.value = products.value.filter((p) => p.id !== id)
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    currentProduct,
    pagination,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  }
})
