<template>
  <div style="padding: 16px;">
    <h2>07-middleware-nuxt</h2>
    <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
      <NuxtLink to="/home">/home (logger)</NuxtLink>
      <NuxtLink to="/about">/about (logger + inline + auth)</NuxtLink>
      <NuxtLink to="/about?block=1">/about?block=1 (abortNavigation)</NuxtLink>
      <NuxtLink to="/about?go=home">/about?go=home (navigateTo)</NuxtLink>
      <NuxtLink to="/profile">/profile (auth)</NuxtLink>
      <NuxtLink to="/login">/login</NuxtLink>
    </div>
  </div>
</template>
