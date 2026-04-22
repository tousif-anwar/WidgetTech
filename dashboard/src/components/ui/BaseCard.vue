<script setup lang="ts">
defineProps<{
  title?: string
  padding?: boolean
}>()
</script>

<template>
  <div class="card">
    <div v-if="title" class="mb-4">
      <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
    </div>
    <slot />
  </div>
</template>
