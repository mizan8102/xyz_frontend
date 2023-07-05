<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>
<script setup lang="ts">
import Chart from 'chart.js/auto';
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps({
  data: {
    type: Array as () => Array<{ KP: number; X: number }>,
    required: true
  }
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  renderChart(chartCanvas.value);
});

const renderChart = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'X',
          data: props.data.map((item) => ({ x: item.KP, y: item.X })),
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false
        }
      ]
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        }
      }
    }
  });
};
</script>

<style>
canvas {
  max-width: 100%;
  height: auto;
}
</style>
