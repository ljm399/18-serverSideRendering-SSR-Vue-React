<template>
  <div>
    <header style="padding: 12px; border-bottom: 1px solid #ddd;">
      <NuxtLink to="/">Home</NuxtLink>
      <span style="margin: 0 8px;">|</span>
      <NuxtLink to="/about">About</NuxtLink>
      <span style="margin: 0 8px;">|</span>
      <NuxtLink to="/client-only">ClientOnly</NuxtLink>
    </header>
    <hr>
    <main style="padding: 12px;">
      <NuxtPage />
    </main>
  </div>
</template>
