<script setup lang="ts">
const counterStore = useCounterStore()
console.log(process.server ? '[server] pinia-a.vue pinia' : '[client] pinia-a.vue pinia', counterStore.count)
</script>

<template>
  <div style="padding: 16px;">
    <div>A Page: {{ counterStore.count }}</div>
    <button @click="counterStore.add()">+1</button>
    <NuxtLink style="margin-left: 12px;" to="/pinia-b">去 B</NuxtLink>
    <NuxtLink style="margin-left: 12px;" to="/">Back</NuxtLink>
  </div>
</template>
