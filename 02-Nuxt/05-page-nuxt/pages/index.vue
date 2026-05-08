<script setup lang="ts">
const router = useRouter()

const goHome = async () => {
  await navigateTo('/home')
}

const replaceToAbout = async () => {
  await navigateTo('/about', { replace: true })
}

const useRouterPush = async () => {
  await router.push({ path: '/detail', query: { from: 'router.push' } })
}

const goExternal = () => {
  navigateTo('https://nuxt.com', { external: true })
} // 外部链接要加 { external: true }，否则会被当成站内路由处理
</script>

<template>
  <div style="padding: 16px;">
    <h2>05-page-nuxt</h2>

    <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
      <NuxtLink to="/home">NuxtLink -> /home</NuxtLink>
      <NuxtLink to="/about" replace>NuxtLink replace -> /about</NuxtLink>
      <NuxtLink to="/detail?from=link">NuxtLink with query</NuxtLink>
    </div>

    <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
      <button @click="goHome">navigateTo('/home')</button>
      <button @click="replaceToAbout">navigateTo('/about', { replace: true })</button>
      <button @click="useRouterPush">router.push(...)</button>
      <button @click="goExternal">navigateTo('https://nuxt.com', { external: true })</button>
    </div>
  </div>
</template>
