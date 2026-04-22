<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import type { StoreSettings } from '@/types'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseTextarea from '@/components/ui/BaseTextarea.vue'

const settingsStore = useSettingsStore()

// Local form state (copy of store settings)
const form = ref<Partial<StoreSettings>>({})
const successMessage = ref('')
const formError = ref('')

onMounted(async () => {
  await settingsStore.fetchSettings()
  if (settingsStore.settings) {
    form.value = { ...settingsStore.settings }
  }
})

watch(
  () => settingsStore.settings,
  (s) => {
    if (s) form.value = { ...s }
  },
)

async function handleSave() {
  successMessage.value = ''
  formError.value = ''
  try {
    await settingsStore.saveSettings(form.value)
    successMessage.value = 'Settings saved!'
  } catch (err: unknown) {
    formError.value = (err as { message: string }).message ?? 'Failed to save settings.'
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Settings</h1>

    <form class="space-y-6" @submit.prevent="handleSave">
      <!-- Store info -->
      <BaseCard title="Store Information">
        <div class="space-y-4">
          <BaseInput v-model="form.storeName as string" label="Store name" placeholder="My Awesome Store" required />
          <BaseTextarea v-model="form.storeDescription as string" label="Store description" placeholder="Tell buyers about your store…" />
          <BaseInput v-model="form.logoUrl as string" label="Logo URL" placeholder="https://…" />
        </div>
      </BaseCard>

      <!-- Widget appearance -->
      <BaseCard title="Widget Appearance">
        <div class="space-y-4">
          <div>
            <label class="label">Theme</label>
            <div class="flex gap-4 mt-1">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.widgetTheme" type="radio" value="light" class="text-primary-600 focus:ring-primary-500" />
                <span class="text-sm">Light</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.widgetTheme" type="radio" value="dark" class="text-primary-600 focus:ring-primary-500" />
                <span class="text-sm">Dark</span>
              </label>
            </div>
          </div>
          <BaseInput v-model="form.primaryColor as string" label="Primary colour (hex)" placeholder="#2563eb" />
          <BaseInput
            :model-value="String(form.defaultProductCount ?? 8)"
            label="Default product count"
            type="number"
            placeholder="8"
            @update:model-value="form.defaultProductCount = Number($event)"
          />
        </div>
      </BaseCard>

      <!-- Notifications -->
      <BaseCard title="Notifications">
        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="form.notifyOnOrder"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="text-sm font-medium text-gray-700">Email me when a new order is placed</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="form.notifyOnLowStock"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="text-sm font-medium text-gray-700">Email me when stock falls below threshold</span>
          </label>
          <BaseInput
            v-if="form.notifyOnLowStock"
            :model-value="String(form.lowStockThreshold ?? 5)"
            label="Low stock threshold"
            type="number"
            placeholder="5"
            @update:model-value="form.lowStockThreshold = Number($event)"
          />
        </div>
      </BaseCard>

      <!-- Feedback -->
      <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
      <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>

      <!-- Save -->
      <div class="flex justify-end">
        <BaseButton type="submit" variant="primary" :loading="settingsStore.loading">
          Save settings
        </BaseButton>
      </div>
    </form>
  </div>
</template>
