<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div style="padding: 16px;">
    <h2>Detail</h2>
    <pre>{{ route.query }}</pre>
    <NuxtLink to="/">Back</NuxtLink>
  </div>
</template>
