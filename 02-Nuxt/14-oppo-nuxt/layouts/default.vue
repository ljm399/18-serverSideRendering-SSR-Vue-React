<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/app-header/index.vue'
import AppFooter from '@/components/app-footer/index.vue'
</script>
