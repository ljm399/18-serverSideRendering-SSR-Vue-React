<template>
  <header class="app-header">
    <div class="app-header__top">
      <div class="wrapper app-header__top-inner">
        <div class="app-header__top-left">
          <a href="javascript:;" class="app-header__top-link">新怡红木官网</a>
          <a href="javascript:;" class="app-header__top-link">红木家具</a>
        </div>

        <div class="app-header__top-right">
          <a
            href="javascript:;"
            class="app-header__top-link app-header__download"
            @mouseenter="showQrcode = true"
            @mouseleave="showQrcode = false"
          >
            添加我的方式
            <div v-show="showQrcode" class="app-header__qrcode-pop">
              <img class="app-header__qrcode-img" :src="qrcodeUrl" alt="qrcode" />
              <div class="app-header__qrcode-text">曹泽卫微信</div>
            </div>
          </a>

          <NuxtLink class="app-header__top-link" to="/login">
            <i class="iconfont icon-user" />
            <span>登录</span>
          </NuxtLink>
          <NuxtLink class="app-header__top-link" to="/register">注册</NuxtLink>

          <NuxtLink class="app-header__top-link app-header__cart" to="/cart">
            <i class="iconfont icon-shoppingcart" />
            <span class="app-header__cart-text">购物车 (0)</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import qrcodePng from '@/assets/images/ecode.png'

export interface IProps {
  title?: string
}

const props = withDefaults(defineProps<IProps>(), {
  title: ''
})

const showQrcode = ref(false)
const qrcodeUrl = qrcodePng
</script>

<style lang="scss">
@import "@/assets/cus-font/iconfont.css";

.app-header {
  background: $bgColor;
}

.app-header__top {
  height: $appHeaderHeight;
  background: #000;
  color: #fff;
  font-size: $fontSize12;
}

.app-header__top-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header__top-left,
.app-header__top-right {
  display: flex;
  align-items: center;
  gap: 0;
}

.app-header__top-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  opacity: 0.85;
  font-size: $fontSize12;
  padding: 0 10px;
}

.app-header__top-link + .app-header__top-link {
  position: relative;
}

.app-header__top-link + .app-header__top-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.35);
}

.app-header__top-link:hover {
  opacity: 1;
}

.app-header__cart {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.app-header__cart-text {
  font-size: $fontSize12;
}

.app-header__download {
  position: relative;
}

.app-header__qrcode-pop {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 180px;
  padding: 12px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  z-index: 20;
}

.app-header__qrcode-img {
  width: 100%;
  display: block;
}

.app-header__qrcode-text {
  margin-top: 8px;
  font-size: $fontSize12;
  color: $textSubColor;
  text-align: center;
}

@media (max-width: 768px) {
  .app-header__top-left {
    display: none;
  }
  .wrapper.app-header__top-inner {
    justify-content: space-evenly;
  }

  .app-header__top-link {
    padding: 0 16px;
  }

  .app-header__cart-text {
    display: none;
  }
}
</style>
