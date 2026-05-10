<script setup lang="ts">
import hyRequest from '@/service/index'
import type { IResultData } from '@/service/index'

const { data } = await hyRequest.get<IResultData<any>>('/homeInfo')
console.log(data.value?.data)
</script>

<template>
  <div style="padding: 16px;">
    <h2>service + ts</h2>
    <pre style="margin-top: 12px;">{{ data }}</pre>
    <NuxtLink to="/">Back</NuxtLink>
  </div>
</template>
