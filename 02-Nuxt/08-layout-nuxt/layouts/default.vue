<template>
  <div>
    <header style="padding: 12px; border-bottom: 1px solid #eee;">
      <NuxtLink to="/">Home</NuxtLink>
      <span style="margin: 0 8px;">|</span>
      <NuxtLink to="/login">Login(auth layout)</NuxtLink>
      <span style="margin: 0 8px;">|</span>
      <NuxtLink to="/no-layout">No Layout</NuxtLink>
    </header>

    <main style="padding: 12px;">
      <slot />
    </main>

    <footer style="padding: 12px; border-top: 1px solid #eee;">Footer</footer>
  </div>
</template>
