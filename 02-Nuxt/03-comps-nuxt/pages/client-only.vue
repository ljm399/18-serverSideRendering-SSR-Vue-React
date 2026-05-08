<template>
  <ClientOnly fallback-tag="h1" fallback="loading...">
      只在客户端显示：{{ new Date().toLocaleString() }}
  </ClientOnly>
</template>
