<script setup lang="ts">
async function login() {
  const { data } = await useFetch('/api/login?id=100', {
    method: 'POST',
    body: {
      username: 'admin',
      password: 123456
    }
  })

  console.log(data.value?.data)

  const cookie = useCookie('token', {
    maxAge: 10
  })

  cookie.value = data.value?.data?.token as string
  return navigateTo('/')
}
</script>

<template>
  <div style="padding: 16px;">
    <h2>login</h2>
    <button @click="login">login</button>
    <NuxtLink style="margin-left: 12px;" to="/">Back</NuxtLink>
  </div>
</template>
