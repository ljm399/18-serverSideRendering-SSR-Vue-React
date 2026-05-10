<script setup lang="ts">
const counter = useCounter()
console.log(process.server ? '[server] b.vue counter' : '[client] b.vue counter', counter.value)

const add = () => {
  counter.value++
}
</script>

<template>
  <div style="padding: 16px;">
    <div>B Page: {{ counter }}</div>
    <button @click="add">+1</button>
    <NuxtLink style="margin-left: 12px;" to="/a">去 A</NuxtLink>
    <NuxtLink style="margin-left: 12px;" to="/">Back</NuxtLink>
  </div>
</template>
