<script setup lang="ts">
const counter = useCounter()
console.log(process.server ? '[server] a.vue counter' : '[client] a.vue counter', counter.value)

const add = () => {
  counter.value++
}
</script>

<template>
  <div style="padding: 16px;">
    <div>A Page: {{ counter }}</div>
    <button @click="add">+1</button>
    <NuxtLink style="margin-left: 12px;" to="/b">去 B</NuxtLink>
    <NuxtLink style="margin-left: 12px;" to="/">Back</NuxtLink>
  </div>
</template>
