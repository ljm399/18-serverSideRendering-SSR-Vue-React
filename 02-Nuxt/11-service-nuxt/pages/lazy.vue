<script setup lang="ts">
type IResultData = {
  data: any
}

const BASE_URL = 'http://localhost:3000/api'

// const { data } = await useFetch<IResultData>(BASE_URL + '/homeInfo', {
//   method: 'GET',
//   lazy: true
// })

const { data } = await useLazyFetch<IResultData>(BASE_URL + '/homeInfo', {
  method: 'GET'
})

console.log(data.value?.data)

watch(data, (newData) => {
  console.log('data=>', newData)
})

onMounted(() => {
  console.log('onMounted')
})
</script>

<template>
  <div style="padding: 16px;">
    <h2>useLazyFetch</h2>
    <pre style="margin-top: 12px;">{{ data }}</pre>
    <NuxtLink to="/">Back</NuxtLink>
  </div>
</template>
