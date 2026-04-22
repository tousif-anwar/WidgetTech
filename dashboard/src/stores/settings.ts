import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StoreSettings } from '@/types'
import { settingsApi } from '@/api/settings'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<StoreSettings | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSettings() {
    loading.value = true
    error.value = null
    try {
      settings.value = await settingsApi.get()
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
    } finally {
      loading.value = false
    }
  }

  async function saveSettings(payload: Partial<StoreSettings>) {
    loading.value = true
    error.value = null
    try {
      settings.value = await settingsApi.update(payload)
    } catch (err: unknown) {
      error.value = (err as { message: string }).message
      throw err
    } finally {
      loading.value = false
    }
  }

  return { settings, loading, error, fetchSettings, saveSettings }
})
