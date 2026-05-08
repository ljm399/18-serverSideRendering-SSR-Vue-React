<template>
  <div style="padding: 16px;">
    <h2>/admin (CSR via routeRules ssr:false)</h2>
    <div>time: {{ time }}</div>
  </div>
</template>

<script setup lang="ts">
const time = ref('')

onMounted(() => {
  time.value = new Date().toLocaleString()
})
</script>
