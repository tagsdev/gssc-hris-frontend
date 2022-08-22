<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<script>
export default {
  name: 'App',
  components: {
    AuthLayout: () => import('./layouts/Auth'),
    UserLayout: () => import('./layouts/User')
  },
  computed: {
    layout() {
      if(this.$route.meta.auth) {
        return 'UserLayout'
      }
      return 'AuthLayout'
    }
  }
}
</script>