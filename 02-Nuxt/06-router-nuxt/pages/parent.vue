<template>
  <div style="padding: 16px;">
    <h2>Parent</h2>
    <div style="margin-top: 12px; display: flex; gap: 8px;">
      <NuxtLink to="/parent">Index</NuxtLink>
      <NuxtLink to="/parent/child">Child</NuxtLink>
    </div>

    <div style="margin-top: 12px; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
      <NuxtPage />
    </div>
  </div>
</template>
