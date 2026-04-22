<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { settingsApi } from '@/api/settings'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const settingsStore = useSettingsStore()

const connectStatus = ref<'not_connected' | 'pending' | 'active' | null>(null)
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  await settingsStore.fetchSettings()
  connectStatus.value = settingsStore.settings?.stripeConnectStatus ?? 'not_connected'
})

async function startOnboarding() {
  loading.value = true
  error.value = ''
  try {
    const { url } = await settingsApi.getStripeConnectUrl()
    window.location.href = url
  } catch (err: unknown) {
    error.value = (err as { message: string }).message ?? 'Failed to start Stripe Connect onboarding.'
    loading.value = false
  }
}

async function refreshStatus() {
  loading.value = true
  error.value = ''
  try {
    const { status } = await settingsApi.getStripeConnectStatus()
    connectStatus.value = status ?? 'not_connected'
  } catch (err: unknown) {
    error.value = (err as { message: string }).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Stripe Connect</h1>

    <BaseCard>
      <div class="flex items-start gap-6">
        <!-- Stripe logo placeholder -->
        <div class="h-14 w-14 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
          <svg class="h-8 w-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Connect your bank account</h2>
          <p class="mt-1 text-sm text-gray-600">
            Link a Stripe Connect account to receive payouts directly to your bank. WidgetAI uses
            Stripe Connect Express for fast, secure seller onboarding.
          </p>
        </div>
      </div>

      <div class="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700">Connection status</p>
            <div class="mt-1 flex items-center gap-2">
              <span
                :class="[
                  'h-2 w-2 rounded-full',
                  connectStatus === 'active' ? 'bg-green-500' :
                  connectStatus === 'pending' ? 'bg-yellow-500' : 'bg-gray-400',
                ]"
              />
              <span class="text-sm font-semibold capitalize">
                {{ connectStatus ?? 'Loading…' }}
              </span>
            </div>
          </div>
          <BaseButton size="sm" variant="secondary" :loading="loading" @click="refreshStatus">
            Refresh
          </BaseButton>
        </div>
      </div>

      <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>

      <div class="mt-6">
        <BaseButton
          v-if="connectStatus !== 'active'"
          variant="primary"
          :loading="loading"
          @click="startOnboarding"
        >
          {{ connectStatus === 'pending' ? 'Continue Stripe onboarding' : 'Connect with Stripe' }}
        </BaseButton>
        <div v-else class="flex items-center gap-2 text-green-700">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-medium">Your Stripe account is connected and active.</span>
        </div>
      </div>
    </BaseCard>

    <!-- FAQ -->
    <BaseCard title="About Stripe Connect">
      <dl class="space-y-4 text-sm">
        <div>
          <dt class="font-medium text-gray-900">How do payouts work?</dt>
          <dd class="mt-1 text-gray-600">
            When a buyer purchases from your store, Stripe automatically splits the payment — your earnings are sent directly to your bank on the standard Stripe payout schedule.
          </dd>
        </div>
        <div>
          <dt class="font-medium text-gray-900">Is my banking information secure?</dt>
          <dd class="mt-1 text-gray-600">
            Yes. WidgetAI never stores your bank details. All sensitive financial information is handled exclusively by Stripe, which is PCI-DSS Level 1 certified.
          </dd>
        </div>
        <div>
          <dt class="font-medium text-gray-900">What countries are supported?</dt>
          <dd class="mt-1 text-gray-600">
            Stripe Connect supports sellers in 40+ countries. Check
            <a href="https://stripe.com/global" target="_blank" rel="noopener" class="text-primary-600 hover:underline">stripe.com/global</a>
            for the full list.
          </dd>
        </div>
      </dl>
    </BaseCard>
  </div>
</template>
