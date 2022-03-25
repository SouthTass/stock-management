import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      components: require('./views/Statistics.vue')
    },
    { 
      path: '/animation', 
      name: 'animation', 
      components: require('./views/Ainmation.vue')
    }
  ]
})
