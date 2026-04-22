<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const formError = ref('')

async function handleSubmit() {
  formError.value = ''
  if (password.value !== confirmPassword.value) {
    formError.value = 'Passwords do not match.'
    return
  }
  try {
    await auth.register(name.value, email.value, password.value)
    router.push('/')
  } catch (err: unknown) {
    formError.value = (err as { message: string }).message ?? 'Registration failed. Please try again.'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary-600">WidgetAI</h1>
        <p class="mt-2 text-gray-600">Create your seller account</p>
      </div>

      <div class="card">
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <BaseInput v-model="name" label="Full name" placeholder="Jane Smith" required />
          <BaseInput v-model="email" label="Email" type="email" placeholder="you@example.com" required />
          <BaseInput v-model="password" label="Password" type="password" placeholder="Min. 8 characters" required />
          <BaseInput v-model="confirmPassword" label="Confirm password" type="password" placeholder="Repeat password" required />

          <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

          <BaseButton type="submit" variant="primary" size="lg" class="w-full" :loading="auth.loading">
            Create account
          </BaseButton>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <RouterLink to="/login" class="text-primary-600 hover:underline font-medium">
            Sign in
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
