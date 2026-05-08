<template>
  <div style="padding: 16px;">
    <h2>全局的slug</h2>
    <div>slug: {{ slug }}</div>
    <div style="margin-top: 12px;">
      <NuxtLink to="/">Back Home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug)
</script>
