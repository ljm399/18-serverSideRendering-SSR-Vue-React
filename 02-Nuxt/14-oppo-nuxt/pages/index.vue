<template>
  <div class="wrapper">
    <Swper />
    <TabCategory @select="onSelect" />
    <SectionCategory :categorys="homeStore.categorys" :navbars="homeStore.navbars" />
  </div>
</template>

<script setup lang="ts">
import Swper from '@/components/swper/index.vue'
import TabCategory from '@/components/tab-category/index.vue'
import SectionCategory from '@/components/section-category/index.vue'

import { useHomeStore } from '~/store/home'

import type { CategoryItem } from '~/store/home'

const homeStore = useHomeStore()

function onSelect(item: CategoryItem) {
  console.log(item)
}
</script>

