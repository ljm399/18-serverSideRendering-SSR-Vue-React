<script setup lang="ts">
const BASE_URL = 'http://localhost:3000/api'

$fetch(BASE_URL + '/homeInfo', {
  method: 'GET'
}).then((res) => {
  console.log(res)
})
</script>

<template>
  <div style="padding: 16px;">
    <h2>$fetch</h2>
    <NuxtLink to="/">Back</NuxtLink>
  </div>
</template>
