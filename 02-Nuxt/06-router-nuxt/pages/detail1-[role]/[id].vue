<template>
  <div style="padding: 16px;">
    <h2>/detail1-:role/:id</h2>
    <div>role: {{ role }}</div>
    <div>id: {{ id }}</div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const role = computed(() => route.params.role)
const id = computed(() => route.params.id)
</script>
