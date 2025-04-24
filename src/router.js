import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      components: require('./views/Statistics.vue'),
      meta: {
        title: '首页'
      }
    },
    {
      path: '/board-ladder',
      name: 'BoardLadder',
      components: require('./views/BoardLadder.vue'),
      meta: {
        title: '连板数据'
      }
    },
    {
      path: '/futures-group',
      name: 'FuturesGroup',
      components: require('./views/FuturesGroup.vue'),
      meta: {
        title: '期货记录'
      }
    },
  ]
})

export default router

router.beforeEach((to, from, next) => {
  // 拦截导航守卫，初始化页面标题
  if(to && to.meta && to.meta.title){
    document.title = to.meta.title
  }else{
    document.title = 'stocketment'
  }
  next()
})
