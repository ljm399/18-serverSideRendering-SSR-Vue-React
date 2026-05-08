<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div style="padding: 16px;">
    <h2>Home</h2>
    <div>from: {{ route.query }}</div>
    <div style="margin-top: 12px;">
      <NuxtLink to="/">Back</NuxtLink>
    </div>
  </div>
</template>
