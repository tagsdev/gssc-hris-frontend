<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'App',
  components: {
    AuthLayout: () => import('./layouts/Auth'),
    UserLayout: () => import('./layouts/User')
  },
  computed: {
    layout() {
      let accessToken = Cookies.get('accessToken')
      if(accessToken) {
        return 'UserLayout'
      }
      return 'AuthLayout'
    }
  }
}
</script>