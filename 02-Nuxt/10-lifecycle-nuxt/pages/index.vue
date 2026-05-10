<script setup lang="ts">
console.log('setup 执行了')

onMounted(() => {
  console.log('onMounted')
})
</script>

<template>
  <div style="padding: 16px;">
    <h2>10-lifecycle-nuxt</h2>
    <div style="margin-top: 12px;">打开终端/控制台看 lifecycle hooks 和 setup/onMounted 的输出</div>
  </div>
</template>
