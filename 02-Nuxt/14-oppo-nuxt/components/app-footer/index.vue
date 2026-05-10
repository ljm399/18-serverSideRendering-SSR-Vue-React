<template>
  <div class="app-footer">app-footer</div>
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
.app-footer {
}
</style>
