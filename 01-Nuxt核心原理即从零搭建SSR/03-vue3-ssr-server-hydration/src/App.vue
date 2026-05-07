<template>
  <div>
    <h1>Vue3 App</h1>
    <button @click="add">+1</button>
    <div>{{ count }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
function add() {
  count.value++
}
</script>
