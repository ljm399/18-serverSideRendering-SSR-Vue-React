<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div style="padding: 16px;">
    <h2>Profile,登录成功</h2>
    <NuxtLink to="/">Back</NuxtLink>
  </div>
</template>
