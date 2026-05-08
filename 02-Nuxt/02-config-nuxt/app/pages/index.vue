<template>
  <div>
    <div style="display: flex; gap: 12px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-top: 12px;">
      <NuxtLink to="/#bottom">To Bottom</NuxtLink>
    </div>
    <NuxtLink>占位Home</NuxtLink>
    <div style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-top: 12px;">
      <div>appConfig.title: {{ appConfig.title }}</div>
      <div>appConfig.theme.primary: {{ appConfig.theme.primary }}</div>
      <div>appConfig.api.prefix: {{ appConfig.api.prefix }}</div>
      <div>{{ fromNuxt.mjl }}</div>

    </div>

    <div style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-top: 12px;">
      <div>public.baseURL: {{ runtimeConfig.public.baseURL }}</div>
    </div>

    <div style="height: 1200px;"></div>
    <div id="bottom" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px;">Bottom
      <NuxtLink to="/">Home</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
const { fromNuxt } = appConfig
</script>
