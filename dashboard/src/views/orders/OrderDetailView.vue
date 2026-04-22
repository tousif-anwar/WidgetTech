<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import type { OrderStatus } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{ id: string }>()
const router = useRouter()
const store = useOrdersStore()

const statusUpdateError = ref('')
const selectedStatus = ref<OrderStatus | ''>('')

onMounted(async () => {
  await store.fetchOrder(props.id)
  if (store.currentOrder) {
    selectedStatus.value = store.currentOrder.status
  }
})

async function handleStatusUpdate() {
  statusUpdateError.value = ''
  if (!selectedStatus.value) return
  try {
    await store.updateOrderStatus(props.id, selectedStatus.value)
  } catch (err: unknown) {
    statusUpdateError.value = (err as { message: string }).message
  }
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
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button class="text-gray-500 hover:text-gray-700" @click="router.back()">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-gray-900">
        Order #{{ id.slice(-8).toUpperCase() }}
      </h1>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="card animate-pulse h-32" />
    </div>

    <template v-else-if="store.currentOrder">
      <!-- Status + actions -->
      <BaseCard title="Order Status">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span :class="['badge text-sm px-3 py-1', statusColors[store.currentOrder.status] ?? 'bg-gray-100 text-gray-700']">
            {{ store.currentOrder.status }}
          </span>
          <div class="flex items-center gap-3 flex-1">
            <select v-model="selectedStatus" class="input max-w-xs">
              <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
            </select>
            <BaseButton
              variant="primary"
              size="sm"
              :loading="store.loading"
              :disabled="selectedStatus === store.currentOrder.status"
              @click="handleStatusUpdate"
            >
              Update
            </BaseButton>
          </div>
        </div>
        <p v-if="statusUpdateError" class="mt-2 text-sm text-red-600">{{ statusUpdateError }}</p>
      </BaseCard>

      <!-- Customer + shipping -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BaseCard title="Customer">
          <dl class="space-y-2 text-sm">
            <div>
              <dt class="text-gray-500">Name</dt>
              <dd class="font-medium text-gray-900">{{ store.currentOrder.buyerName }}</dd>
            </div>
            <div>
              <dt class="text-gray-500">Email</dt>
              <dd class="font-medium text-gray-900">{{ store.currentOrder.buyerEmail }}</dd>
            </div>
          </dl>
        </BaseCard>
        <BaseCard title="Shipping Address">
          <address class="text-sm text-gray-900 not-italic space-y-1">
            <p>{{ store.currentOrder.shippingAddress.line1 }}</p>
            <p v-if="store.currentOrder.shippingAddress.line2">{{ store.currentOrder.shippingAddress.line2 }}</p>
            <p>{{ store.currentOrder.shippingAddress.city }}, {{ store.currentOrder.shippingAddress.state }} {{ store.currentOrder.shippingAddress.postalCode }}</p>
            <p>{{ store.currentOrder.shippingAddress.country }}</p>
          </address>
        </BaseCard>
      </div>

      <!-- Line items -->
      <BaseCard title="Items">
        <div class="divide-y divide-gray-100">
          <div
            v-for="item in store.currentOrder.lineItems"
            :key="item.id"
            class="flex items-center gap-4 py-3"
          >
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.productName"
              class="h-12 w-12 rounded-lg object-cover shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ item.productName }}</p>
              <p class="text-xs text-gray-500">{{ item.variantName }} · Qty: {{ item.quantity }}</p>
            </div>
            <p class="text-sm font-semibold text-gray-900 shrink-0">${{ item.totalPrice.toFixed(2) }}</p>
          </div>
        </div>

        <!-- Totals -->
        <div class="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <div class="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>${{ store.currentOrder.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-600">
            <span>Tax</span>
            <span>${{ store.currentOrder.tax.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span>${{ store.currentOrder.shippingCost.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>${{ store.currentOrder.total.toFixed(2) }}</span>
          </div>
        </div>
      </BaseCard>

      <!-- Notes -->
      <BaseCard v-if="store.currentOrder.notes" title="Order Notes">
        <p class="text-sm text-gray-700">{{ store.currentOrder.notes }}</p>
      </BaseCard>
    </template>

    <div v-else class="card text-center py-12 text-sm text-gray-500">
      Order not found.
    </div>
  </div>
</template>
