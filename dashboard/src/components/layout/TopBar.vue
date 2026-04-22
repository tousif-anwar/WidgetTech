<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineEmits<{ 'toggle-sidebar': [] }>()

const auth = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
    <!-- Sidebar toggle (mobile) -->
    <button
      class="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
      @click="$emit('toggle-sidebar')"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div class="flex-1" />

    <!-- User menu -->
    <div class="relative">
      <button
        class="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 transition-colors"
        @click="menuOpen = !menuOpen"
      >
        <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
          {{ auth.user?.name?.charAt(0).toUpperCase() ?? 'U' }}
        </div>
        <span class="hidden sm:block text-sm font-medium text-gray-700">{{ auth.user?.name }}</span>
        <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown -->
      <Transition
        enter-active-class="duration-100 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="duration-75 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="menuOpen"
          class="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-black/5 py-1 z-50"
          @click.stop
        >
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-medium text-gray-900 truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ auth.user?.email }}</p>
          </div>
          <button
            class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            @click="handleLogout"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </Transition>
    </div>

    <!-- Close dropdown when clicking outside -->
    <div v-if="menuOpen" class="fixed inset-0 z-40" @click="menuOpen = false" />
  </header>
</template>
