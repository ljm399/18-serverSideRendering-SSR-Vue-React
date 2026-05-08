<script setup lang="ts">
definePageMeta({
  validate: (route) => {
    const id = String(route.params.id)
    return /^\d+$/.test(id)
  }
})

const route = useRoute()
</script>

<template>
  <div style="padding: 16px;">
    <h2>User: {{ route.params.id }}</h2>
    <NuxtLink to="/">Back</NuxtLink>
  </div>
</template>
