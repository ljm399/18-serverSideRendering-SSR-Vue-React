<script setup lang="ts">
const error = useError()
</script>

<template>
  <div style="padding: 16px;">
    <h2>Error: {{ error?.statusCode }}</h2>
    <div>{{ error?.statusMessage }}</div>

    <button style="margin-top: 12px;" @click="clearError({ redirect: '/' })">Back Home</button>
  </div>
</template>
