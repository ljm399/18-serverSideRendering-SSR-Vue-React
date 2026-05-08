<template>
  <div style="padding: 16px;">
    <h2>detail/[...slug]</h2>
    <div>slug: {{ slug }}</div>
    <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
      <NuxtLink to="/detail/1/2">/detail/1/2</NuxtLink>
      <NuxtLink to="/detail/a/b/c">/detail/a/b/c</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug)
</script>
