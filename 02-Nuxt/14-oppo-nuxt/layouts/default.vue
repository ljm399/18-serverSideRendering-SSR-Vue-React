<template>
  <div>
    <AppHeader />
    <NavBar />
    <slot />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/app-header/index.vue'
import AppFooter from '@/components/app-footer/index.vue'
import NavBar from '@/components/nav-bar/index.vue'
import { useHomeStore } from '~/store/home'
const homeStore = useHomeStore()
await homeStore.getOPPOInfo()
</script>
