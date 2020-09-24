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
        path: '/users',
        name: 'users',
        component: () => import('../components/user/user')
      },
      {
        path: '/roles',
        name: 'roleList',
        component: () => import('../components/roleList/roleList')
      },
      {
        path: '/rights',
        name: 'authorityList',
        component: () => import('../components/authorityList/authorityList')
      },
      {
        path: '/goods',
        name: 'goodsList',
        component: () => import('../components/goodsList/goodsList')
      },
      {
        path: '/addGoods',
        name: 'addGoods',
        component: () => import('../components/addGoods/addGoods')
      },
      {
        path: '/params',
        name: 'classParams',
        component: () => import('../components/classParams/classParams')
      },
      {
        path: '/categories',
        name: 'goodsClass',
        component: () => import('../components/goodsClass/goodsClass')
      },
      {
        path: '/orders',
        name: 'orderList',
        component: () => import('../components/orderList/orderList')
      },
      {
        path: '/reports',
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
