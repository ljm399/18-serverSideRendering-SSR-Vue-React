<script setup lang="ts">
const route = useRoute()
const token = useCookie('token')

const onLogin = async () => {
  token.value = 'mock-token'
  const redirect = (route.query.redirect as string) || '/'
  await navigateTo(redirect)
}

const onLogout = () => {
  token.value = null
}
</script>

<template>
  <div style="padding: 16px;">
    <h2>Login</h2>
    <div style="margin-top: 12px; display: flex; gap: 8px;">
      <button @click="onLogin">Login</button>
      <button @click="onLogout">Clear token</button>
    </div>
    <div style="margin-top: 12px;">
      <NuxtLink to="/">Back</NuxtLink>
    </div>
  </div>
</template>
