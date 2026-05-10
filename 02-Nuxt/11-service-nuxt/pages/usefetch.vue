<script setup lang="ts">
type IResultData = {
  data: any
}

const BASE_URL = 'http://localhost:3000/api'
const count = ref(1)

const { data, refresh } = await useFetch<IResultData>('/goods', {
  method: 'POST',
  baseURL: BASE_URL,
  body: {
    count
  },

  onRequest({ options }) {
    console.log(options.method,'我是onRequest  options。methods')
    options.headers = {
      token: 'xxxx'
    }
  },
  onRequestError() {
    console.log('onRequestError','我是onRequestError')
  },

  onResponse({ response }) {
    console.log(response._data.data.server_jsonstr,'我是onResponse')
    return response._data.data.server_jsonstr
  },
  onResponseError() {
    console.log('onResponseError','我是onRspError')
  }
})

watch(data,(newData)=>{
  console.log(newData,'我是newdata')
})

console.log(data.value?.data,'我是data')

function refreshPage() {
  // count.value++
  refresh()
}
</script>

<template>
  <div style="padding: 16px;">
    <h2>useFetch</h2>
    <pre style="margin-top: 12px;">{{ data }}</pre>
    <NuxtLink to="/">Back</NuxtLink>
    <button @click="refreshPage">+1</button>
  </div>
</template>
