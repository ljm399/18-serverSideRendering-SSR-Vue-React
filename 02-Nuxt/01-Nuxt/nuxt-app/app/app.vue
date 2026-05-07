<template>
  <div>
    <div style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-top: 12px;">
      <div>public.baseURL: {{ runtimeConfig.public.baseURL }}</div>
    </div>
    <NuxtWelcome />
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
console.log('runtimeConfig', runtimeConfig)
if (process.server) {
  console.log('hy[server]的runtimeConfig.appKey:', runtimeConfig.appKey)
  console.log('hy[server]的runtimeConfig.public.baseURL:', runtimeConfig.public.baseURL)
}

// 判断是client方法一
if (process.client) {
  console.log('hy方法一[client] runtimeConfig.public.baseURL:', runtimeConfig.public.baseURL)
}

// 判断是client方法二
if (typeof window !== 'undefined') {
  console.log('hy方法二[client] runtimeConfig.public.baseURL:', runtimeConfig.public.baseURL)
}
</script>