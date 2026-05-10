<template>
  <div class="emtry-layout">emtry-layout</div>
</template>

<script setup lang="ts">
export interface IProps {
  title?: string
}

const props = withDefaults(defineProps<IProps>(), {
  title: ''
})
</script>

<style lang="scss">
.emtry-layout {
}
</style>
