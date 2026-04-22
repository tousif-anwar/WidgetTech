<script setup lang="ts" generic="T extends Record<string, unknown>">
export interface TableColumn<Row> {
  key: keyof Row | string
  label: string
  class?: string
}

defineProps<{
  columns: TableColumn<T>[]
  rows: T[]
  loading?: boolean
  emptyMessage?: string
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="col in columns"
            :key="String(col.key)"
            :class="['px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', col.class ?? '']"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-100">
        <!-- Loading skeleton -->
        <template v-if="loading">
          <tr v-for="n in 5" :key="n">
            <td v-for="col in columns" :key="String(col.key)" class="px-6 py-4">
              <div class="h-4 bg-gray-200 rounded animate-pulse" />
            </td>
          </tr>
        </template>

        <!-- Empty state -->
        <tr v-else-if="rows.length === 0">
          <td :colspan="columns.length" class="px-6 py-12 text-center text-sm text-gray-500">
            {{ emptyMessage ?? 'No data found.' }}
          </td>
        </tr>

        <!-- Data rows -->
        <template v-else>
          <tr
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="col in columns"
              :key="String(col.key)"
              :class="['px-6 py-4 whitespace-nowrap text-sm text-gray-900', col.class ?? '']"
            >
              <slot :name="`cell-${String(col.key)}`" :row="row" :value="row[col.key as keyof T]">
                {{ row[col.key as keyof T] }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
