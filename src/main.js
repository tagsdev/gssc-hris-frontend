import Vue from 'vue'
import LaravelPermissionToVueJS from 'laravel-permission-to-vuejs'
import App from './App.vue'
import router from './router'
import store from './store'
import './quasar'

Vue.config.productionTip = false

Vue.use(LaravelPermissionToVueJS)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')