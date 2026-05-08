<template>
  <div class="container">
    <h1>Style Demo</h1>

    <div class="box">scoped box</div>

    <div style="margin-top: 12px;">
      <a href="https://nuxt.com" target="_blank">Nuxt</a>
    </div>

    <hr>
    <div>
      <img src="/images/logo.svg" alt="logo" width="120" />
    </div>

    <hr>
    <div>
      <img :src="assetLogo" alt="logo" width="120" />
    </div>

    <hr>
    <div>
      <img :src="logoUrl" alt="logo" width="120" />
    </div>

    <hr>
    <div>
      <i class="iconfont icon-home" />
    </div>

    <hr>
    <loading-four theme="outline" size="24" fill="#333"/>
    <hr>
    <div style="margin-top: 12px;">
      <button class="btn" type="button">Button from global.scss</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import assetLogo from '~/assets/imgs/img2.jpg'
import { logoUrl } from '~/assets/images'
</script>

<style scoped lang="scss">
.box {
  padding: 12px;
  border: 1px solid #ddd;
  color: $primary;
}
</style>
