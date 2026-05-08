<template>
  <NuxtPage />
  <!-- <Title>mjlcode - Nuxt App</Title>
  <Meta name="description" content="Home page description hymjlcode" /> -->
  <Head>
    <Title>Home - Nuxt App</Title>
    <Meta name="description" content="Home page description" />
  </Head>
</template>

<script setup>
useHead({
  title: 'app - Nuxt App',
  meta: [
    { name: 'description', content: 'app page description' }
  ]
})
</script>

<style>
.active {
  color: #fff;
  background: #333;
  padding: 2px 6px;
  border-radius: 4px;
}

.exact-active {
  outline: 2px solid #333;
}
</style>