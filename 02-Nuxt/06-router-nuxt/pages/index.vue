<template>
  <div style="padding: 16px;">
    <h2>06-router-nuxt</h2>

    <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
      <NuxtLink to="/user/123">/user/123</NuxtLink>
      <NuxtLink to="/user/abc">/user/abc (invalid -> error)</NuxtLink>
      <NuxtLink to="/parent">Nested(嵌套) route: /parent</NuxtLink>
      <NuxtLink to="/parent/child">Nested(嵌套) route: /parent/child</NuxtLink>
      <NuxtLink to="/admin">/admin (routeRules: ssr:false)</NuxtLink>
      <NuxtLink to="/landing">/landing (routeRules: prerender)</NuxtLink>
      <NuxtLink to="/blog">/blog (routeRules: isr)</NuxtLink>
      <NuxtLink to="/old-home">/old-home (routeRules: redirect)</NuxtLink>
      <NuxtLink to="/profile">/profile (routeRules: headers)</NuxtLink>
      <NuxtLink to="/detail/admin/1">/detail/:role/:id</NuxtLink>
      <NuxtLink to="/detail1-admin/1">/detail-:role/:id</NuxtLink>
      <NuxtLink to="/detail/1/2">/detail/[...slug]</NuxtLink>
      <NuxtLink to="/detail">/detail (index)</NuxtLink>
      <NuxtLink to="/this-path-not-exist">/[...slug] catch all</NuxtLink>
    </div>
  </div>
</template>
