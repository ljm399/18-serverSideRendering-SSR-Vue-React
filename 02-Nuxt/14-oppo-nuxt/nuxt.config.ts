import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  pages: true,
  modules: ['@pinia/nuxt'],
  css: ['normalize.css/normalize.css', '~/assets/css/reset.scss', '~/assets/css/global.scss'],
  vite: {
    ssr: {
      noExternal: ['element-plus'],
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['assets/css'],
          additionalData: '@use "variables.scss" as *;'
        }
      }
    },
    // server: {
    //   proxy: {
    //     '/oppo': {
    //       target: 'http://localhost:8000',
    //       changeOrigin: true,
    //       // rewrite: (path) => path.replace(/^\/api/, '')
    //     }
    //   }
    // }
  },
  app: {
    // 给所有app所有的页面的head添加默认的meta和link标签。。。（SEO, 添加外部的资源）
    head: {
      title: "新怡红木家具",
      meta: [
        {
          name: "description",
          content:
            "新怡红木家具始于1988年，卖的良心，守的是初心",
        },
        {
          name: "keywords",
          content: "新怡红木，红木家具，家具",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        // { rel: "stylesheet", href: "https://liujun.css" }
      ],
      noscript: [{ innerHTML: "Javascript is required" }], // 如果用户禁用了js，显示的内容
    },
  },
})
