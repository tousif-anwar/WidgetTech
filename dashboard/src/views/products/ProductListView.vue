<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const router = useRouter()
const store = useProductsStore()

const searchQuery = ref('')
const deleteTargetId = ref<string | null>(null)

onMounted(() => store.fetchProducts())

function handleSearch() {
  store.fetchProducts({ query: searchQuery.value || undefined })
}

function confirmDelete(id: string) {
  deleteTargetId.value = id
}

async function executeDelete() {
  if (!deleteTargetId.value) return
  await store.deleteProduct(deleteTargetId.value)
  deleteTargetId.value = null
}

function changePage(page: number) {
  store.fetchProducts({ query: searchQuery.value || undefined, page })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Products</h1>
      <BaseButton variant="primary" @click="router.push('/products/new')">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Product
      </BaseButton>
    </div>

    <!-- Search -->
    <BaseCard>
      <form class="flex gap-3" @submit.prevent="handleSearch">
        <input
          v-model="searchQuery"
          class="input flex-1"
          placeholder="Search products by name or category…"
        />
        <BaseButton type="submit" variant="secondary">Search</BaseButton>
      </form>
    </BaseCard>

    <!-- Table -->
    <BaseCard>
      <div v-if="store.loading" class="space-y-3">
        <div v-for="n in 8" :key="n" class="h-12 bg-gray-100 rounded animate-pulse" />
      </div>

      <div v-else-if="store.products.length === 0" class="py-16 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p class="mt-4 text-sm text-gray-500">No products yet. Add your first product!</p>
        <BaseButton class="mt-4" @click="router.push('/products/new')">Add Product</BaseButton>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="product in store.products" :key="product.id" class="hover:bg-gray-50">
                <td class="px-4 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      v-if="product.imageUrls.length"
                      :src="product.imageUrls[0]"
                      :alt="product.name"
                      class="h-10 w-10 rounded-lg object-cover"
                    />
                    <div
                      v-else
                      class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                      <p class="text-xs text-gray-500 line-clamp-1">{{ product.description }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm text-gray-600">{{ product.category }}</td>
                <td class="px-4 py-4 text-sm font-medium text-gray-900">${{ product.price.toFixed(2) }}</td>
                <td class="px-4 py-4">
                  <span :class="['badge', product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
                    {{ product.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <BaseButton size="sm" variant="secondary" @click="router.push(`/products/${product.id}/edit`)">
                      Edit
                    </BaseButton>
                    <BaseButton size="sm" variant="danger" @click="confirmDelete(product.id)">
                      Delete
                    </BaseButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="store.pagination.totalPages > 1" class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p class="text-sm text-gray-600">
            Page {{ store.pagination.page }} of {{ store.pagination.totalPages }}
            ({{ store.pagination.total }} products)
          </p>
          <div class="flex gap-2">
            <BaseButton
              size="sm"
              variant="secondary"
              :disabled="store.pagination.page <= 1"
              @click="changePage(store.pagination.page - 1)"
            >
              Previous
            </BaseButton>
            <BaseButton
              size="sm"
              variant="secondary"
              :disabled="store.pagination.page >= store.pagination.totalPages"
              @click="changePage(store.pagination.page + 1)"
            >
              Next
            </BaseButton>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Delete confirmation modal -->
    <BaseModal
      :open="deleteTargetId !== null"
      title="Delete Product"
      size="sm"
      @close="deleteTargetId = null"
    >
      <p class="text-sm text-gray-600">
        Are you sure you want to delete this product? This action cannot be undone.
      </p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" @click="deleteTargetId = null">Cancel</BaseButton>
          <BaseButton variant="danger" :loading="store.loading" @click="executeDelete">
            Delete
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
