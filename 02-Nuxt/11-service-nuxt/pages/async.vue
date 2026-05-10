<script setup lang="ts">
type IResultData = {
  data: any
}

const BASE_URL = 'http://localhost:3000/api'

const { data } = await useAsyncData<IResultData>('homeInfo', () => {
  return $fetch(BASE_URL + '/homeInfo', { method: 'GET' })
})

// 当homeInfo2是 homeInfo即和上面的一样，则data2和data一样，且报错
const data2 = await useAsyncData<IResultData>('homeInfo2', () => {
  return $fetch("http://localhost:8000" + '/moment?offset=0&size=10', { method: 'GET' })
})

console.log(data.value?.data)
console.log(data2,'/moment?offset=0&size=10');

</script>

<template>
  <div style="padding: 16px;">
    <h2>useAsyncData</h2>
    <pre style="margin-top: 12px;">{{ data }}</pre>
    <NuxtLink to="/">Back</NuxtLink>
  </div>
</template>
