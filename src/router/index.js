import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/home'),
    children: [
      {
        path: '/user',
        name: 'user',
        component: () => import('../components/user/user')
      },
      {
        path: '/roleList',
        name: 'roleList',
        component: () => import('../components/roleList/roleList')
      },
      {
        path: '/authorityList',
        name: 'authorityList',
        component: () => import('../components/authorityList/authorityList')
      },
      {
        path: '/goodsList',
        name: 'goodsList',
        component: () => import('../components/goodsList/goodsList')
      },
      {
        path: '/classParams',
        name: 'classParams',
        component: () => import('../components/classParams/classParams')
      },
      {
        path: '/goodsClass',
        name: 'goodsClass',
        component: () => import('../components/goodsClass/goodsClass')
      },
      {
        path: '/orderList',
        name: 'orderList',
        component: () => import('../components/orderList/orderList')
      },
      {
        path: '/chart',
        name: 'chart',
        component: () => import('../components/chart/chart')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
