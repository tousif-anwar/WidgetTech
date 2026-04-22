<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const formError = ref('')

async function handleSubmit() {
  formError.value = ''
  try {
    await auth.login(email.value, password.value)
    const redirect = (route.query.redirect as string) ?? '/'
    router.push(redirect)
  } catch (err: unknown) {
    formError.value = (err as { message: string }).message ?? 'Login failed. Please try again.'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary-600">WidgetAI</h1>
        <p class="mt-2 text-gray-600">Sign in to your seller dashboard</p>
      </div>

      <!-- Card -->
      <div class="card">
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <BaseInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
          />
          <BaseInput
            v-model="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />

          <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

          <BaseButton type="submit" variant="primary" size="lg" class="w-full" :loading="auth.loading">
            Sign in
          </BaseButton>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <RouterLink to="/register" class="text-primary-600 hover:underline font-medium">
            Sign up
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
