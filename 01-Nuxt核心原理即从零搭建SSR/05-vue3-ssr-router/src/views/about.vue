<template>
  <div class="app" style="border: 1px solid blue; margin: 10px">
    <h2>About</h2>
    <div>{{ count }}</div>
    <button @click="addCounter">+1</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(300)
function addCounter() {
  count.value++
}
</script>
