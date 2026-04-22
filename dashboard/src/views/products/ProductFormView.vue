<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import type { ProductCreateRequest, ProductVariant } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'

const props = defineProps<{ id?: string }>()
const router = useRouter()
const store = useProductsStore()

const isEditing = computed(() => !!props.id)

// Form state
const name = ref('')
const description = ref('')
const price = ref('')
const category = ref('')
const tagsInput = ref('')
const isActive = ref(true)
const formError = ref('')
const successMessage = ref('')

interface VariantForm {
  sku: string
  name: string
  price: string
  stock: string
  attributes: string
}

const variants = ref<VariantForm[]>([{ sku: '', name: '', price: '', stock: '', attributes: '' }])

function addVariant() {
  variants.value.push({ sku: '', name: '', price: '', stock: '', attributes: '' })
}

function removeVariant(idx: number) {
  variants.value.splice(idx, 1)
}

onMounted(async () => {
  if (isEditing.value && props.id) {
    await store.fetchProduct(props.id)
    const p = store.currentProduct
    if (p) {
      name.value = p.name
      description.value = p.description
      price.value = String(p.price)
      category.value = p.category
      tagsInput.value = p.tags.join(', ')
      isActive.value = p.isActive
      if (p.variants.length) {
        variants.value = p.variants.map((v: ProductVariant) => ({
          sku: v.sku,
          name: v.name,
          price: String(v.price),
          stock: String(v.stock),
          attributes: JSON.stringify(v.attributes),
        }))
      }
    }
  }
})

function buildPayload(): ProductCreateRequest {
  return {
    name: name.value.trim(),
    description: description.value.trim(),
    price: parseFloat(price.value),
    category: category.value.trim(),
    tags: tagsInput.value.split(',').map((t) => t.trim()).filter(Boolean),
    isActive: isActive.value,
    variants: variants.value.map((v) => ({
      sku: v.sku.trim(),
      name: v.name.trim(),
      price: parseFloat(v.price) || 0,
      stock: parseInt(v.stock, 10) || 0,
      attributes: v.attributes ? (JSON.parse(v.attributes) as Record<string, string>) : {},
    })),
  }
}

async function handleSubmit() {
  formError.value = ''
  successMessage.value = ''
  try {
    if (isEditing.value && props.id) {
      await store.updateProduct(props.id, buildPayload())
      successMessage.value = 'Product updated successfully!'
    } else {
      await store.createProduct(buildPayload())
      router.push('/products')
    }
  } catch (err: unknown) {
    formError.value = (err as { message: string }).message ?? 'Failed to save product.'
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button class="text-gray-500 hover:text-gray-700" @click="router.back()">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEditing ? 'Edit Product' : 'New Product' }}
      </h1>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Basic info -->
      <BaseCard title="Product Information">
        <div class="space-y-4">
          <BaseInput v-model="name" label="Product name" required placeholder="e.g. Wireless Headphones" />
          <BaseTextarea v-model="description" label="Description" required placeholder="Describe your product…" />
          <div class="grid grid-cols-2 gap-4">
            <BaseInput v-model="price" label="Price ($)" type="number" required placeholder="0.00" />
            <BaseInput v-model="category" label="Category" required placeholder="e.g. Electronics" />
          </div>
          <BaseInput v-model="tagsInput" label="Tags (comma-separated)" placeholder="e.g. wireless, audio, premium" />
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="isActive" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span class="text-sm font-medium text-gray-700">Active (visible in widget)</span>
          </label>
        </div>
      </BaseCard>

      <!-- Variants -->
      <BaseCard title="Variants">
        <div class="space-y-4">
          <div
            v-for="(variant, idx) in variants"
            :key="idx"
            class="rounded-lg border border-gray-200 p-4 space-y-3"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Variant {{ idx + 1 }}</span>
              <button
                v-if="variants.length > 1"
                type="button"
                class="text-red-500 hover:text-red-700 text-xs"
                @click="removeVariant(idx)"
              >
                Remove
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <BaseInput v-model="variant.sku" label="SKU" placeholder="SKU-001" />
              <BaseInput v-model="variant.name" label="Variant name" placeholder="e.g. Black / M" />
              <BaseInput v-model="variant.price" label="Price ($)" type="number" placeholder="0.00" />
              <BaseInput v-model="variant.stock" label="Stock" type="number" placeholder="0" />
            </div>
            <BaseInput v-model="variant.attributes" label="Attributes (JSON)" placeholder='{"color":"black","size":"M"}' />
          </div>

          <BaseButton type="button" variant="secondary" size="sm" @click="addVariant">
            + Add variant
          </BaseButton>
        </div>
      </BaseCard>

      <!-- Feedback -->
      <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
      <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3">
        <BaseButton type="button" variant="secondary" @click="router.back()">Cancel</BaseButton>
        <BaseButton type="submit" variant="primary" :loading="store.loading">
          {{ isEditing ? 'Save changes' : 'Create product' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>
