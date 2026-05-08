<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const token = useCookie('token')

const onLogin = async () => {
  token.value = 'mock-token'
  const redirect = (route.query.redirect as string) || '/'
  await navigateTo(redirect)
}
</script>

<template>
  <div>
    <h2>Login</h2>
    <div style="margin-top: 12px; display: flex; gap: 8px;">
      <button @click="onLogin">Login</button>
      <NuxtLink to="/">Back</NuxtLink>
    </div>
  </div>
</template>
