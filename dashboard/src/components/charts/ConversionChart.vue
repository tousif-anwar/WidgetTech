<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { ConversionFunnel } from '@/types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  funnel: ConversionFunnel
}>()

const chartData = computed(() => ({
  labels: ['Impressions', 'Clicks', 'Added to Cart', 'Checkout', 'Purchased'],
  datasets: [
    {
      label: 'Users',
      data: [
        props.funnel.impressions,
        props.funnel.clicks,
        props.funnel.addedToCart,
        props.funnel.checkoutStarted,
        props.funnel.purchased,
      ],
      backgroundColor: [
        'rgba(37,99,235,0.8)',
        'rgba(37,99,235,0.65)',
        'rgba(37,99,235,0.5)',
        'rgba(37,99,235,0.35)',
        'rgba(37,99,235,0.2)',
      ],
      borderRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
}
</script>

<template>
  <div class="relative h-56">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
