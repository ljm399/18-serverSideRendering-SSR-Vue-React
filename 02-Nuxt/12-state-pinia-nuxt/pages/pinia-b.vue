<script setup lang="ts">
const counterStore = useCounterStore()
console.log(process.server ? '[server] pinia-b.vue pinia' : '[client] pinia-b.vue pinia', counterStore.count)
</script>

<template>
  <div style="padding: 16px;">
    <div>B Page: {{ counterStore.count }}</div>
    <button @click="counterStore.add()">+1</button>
    <NuxtLink style="margin-left: 12px;" to="/pinia-a">去 A</NuxtLink>
    <NuxtLink style="margin-left: 12px;" to="/">Back</NuxtLink>
  </div>
</template>
