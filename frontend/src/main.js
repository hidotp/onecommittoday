import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  data: {
    user: JSON.parse(window.localStorage.getItem('user'))
  }
}).$mount('#app')
