<script setup lang="ts">
definePageMeta({
  middleware: [
    'logger',
    defineNuxtRouteMiddleware((to, from) => {
      console.log('[inline]', { from: from.fullPath, to: to.fullPath })

      if (to.query.block === '1') {
        return abortNavigation({ message: 'blocked by inline middleware' })
      }

      if (to.query.go === 'home') {
        return navigateTo('/home')
      }
    }),
    'auth'
  ]
})
</script>

<template>
  <div style="padding: 16px;">
    <h2>About</h2>
    <NuxtLink to="/">Back</NuxtLink>
  </div>
</template>
