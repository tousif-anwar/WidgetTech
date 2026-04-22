<script setup lang="ts">
defineProps<{
  label?: string
  modelValue: string
  placeholder?: string
  rows?: number
  error?: string
  required?: boolean
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows ?? 4"
      :required="required"
      :disabled="disabled"
      :class="[
        'input resize-y',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
        disabled ? 'bg-gray-50 cursor-not-allowed' : '',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>
