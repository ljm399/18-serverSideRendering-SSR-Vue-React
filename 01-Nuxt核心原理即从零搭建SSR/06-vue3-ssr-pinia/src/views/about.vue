<template>
  <div class="app" style="border: 1px solid blue; margin: 10px">
    <h2>About</h2>
    <div>{{ count }}</div>
    <button @click="addCounter">+1</button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useHomeStore } from '../store/home'

const homeStore = useHomeStore()
const { count } = storeToRefs(homeStore)

function addCounter() {
  homeStore.increment()
}
</script>
