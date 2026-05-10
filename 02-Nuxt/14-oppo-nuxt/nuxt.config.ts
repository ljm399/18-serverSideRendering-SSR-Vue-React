// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  pages: true,
  css: ['normalize.css/normalize.css', '~/assets/css/reset.scss', '~/assets/css/global.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['assets/css'],
          additionalData: '@use "variables.scss" as *;'
        }
      }
    }
  },
  app: {
    // 给所有app所有的页面的head添加默认的meta和link标签。。。（SEO, 添加外部的资源）
    head: {
      title: "OPPO官网商城",
      meta: [
        {
          name: "description",
          content:
            "OPPO专区，官方正品，最新最全的OPPO手机产品以及配件在线抢购！",
        },
        {
          name: "keywords",
          content: "OPPO商城，OPPO专区, OPPO手机，OPPO配件，OPPO, OPPO官网商城",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        // { rel: "stylesheet", href: "https://liujun.css" }
      ],
      noscript: [{ children: "Javascript is required" }], // 如果用户禁用了js，显示的内容
    },
  },
})
