<template>
  <div style="padding: 16px;">
    <h2>11-service-nuxt</h2>

    <div style="margin-top: 12px;">Data Fetch</div>
    <div style="margin-top: 8px;">
      <NuxtLink to="/fetch">$fetch</NuxtLink>
    </div>
    <div style="margin-top: 8px;">
      <NuxtLink to="/async">useAsyncData</NuxtLink>
    </div>
    <div style="margin-top: 8px;">
      <NuxtLink to="/usefetch">useFetch</NuxtLink>
    </div>
    <div style="margin-top: 8px;">
      <NuxtLink to="/lazy">useLazyFetch</NuxtLink>
    </div>
    <div style="margin-top: 12px;">Server API</div>
    <div style="margin-top: 8px;">
      <NuxtLink to="/login">login + useCookie</NuxtLink>
    </div>
    <div style="margin-top: 12px;">Service + TS</div>
    <div style="margin-top: 8px;">
      <NuxtLink to="/service">useFetch wrapper</NuxtLink>
    </div>
  </div>
</template>
