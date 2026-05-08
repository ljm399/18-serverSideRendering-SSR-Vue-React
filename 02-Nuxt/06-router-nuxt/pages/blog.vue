<template>
  <div style="padding: 16px;">
    <h2>/blog (isr: 60)</h2>
    <div>time: {{ now }}</div>
  </div>
</template>

<script setup lang="ts">
const now = new Date().toLocaleString()
</script>
