<script setup lang="ts">
const { $sayHello, $ua } = useNuxtApp()
</script>

<template>
  <div style="padding: 16px;">
    <h2>09-plugin-nuxt</h2>

    <div style="margin-top: 12px;">
      <div>$sayHello: {{ $sayHello('nuxt') }}</div>
    </div>

    <div style="margin-top: 12px;">
      <div>UserAgent (client-only plugin):</div>
      <ClientOnly fallback="(server render will be empty)">
        <div style="word-break: break-all;">{{ $ua }}</div>
      </ClientOnly>
    </div>
  </div>
</template>
