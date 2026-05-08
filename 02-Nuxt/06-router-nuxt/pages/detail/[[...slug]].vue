<template>
  <div style="padding: 16px;">
    <h2>detail/[[...slug]]</h2>
    <div>slug: {{ slug }}</div>
    <div style="margin-top: 12px;">
      <div>Recommended in this project:</div>
      <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
        <NuxtLink to="/detail">/detail (detail/index.vue)</NuxtLink>
        <NuxtLink to="/detail/1/2">/detail/1/2 (detail/[...slug].vue)</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug)
</script>
