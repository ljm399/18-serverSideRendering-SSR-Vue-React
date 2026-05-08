<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

<template>
  <div style="padding: 16px;">
    <h2>No Layout</h2>
    <div>This page disables layout via <code>layout: false</code>.</div>
    <div style="margin-top: 12px;">
      <NuxtLink to="/">Back</NuxtLink>
    </div>
  </div>
</template>
