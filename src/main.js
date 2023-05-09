import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './filters'

import Api from './api/api'
Vue.prototype.$api = Api

import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
