<template>
  <div class="app" style="border: 1px solid red">
    <h2>Vue3 App</h2>

    <div>
      <router-link to="/">
        <button>home</button>
      </router-link>
      <router-link to="/about">
        <button>about</button>
      </router-link>
    </div>

    <router-view />
  </div>
</template>
