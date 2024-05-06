import { createRouter, createWebHistory } from 'vue-router'
import ConsoleLayout from '@/layouts/ConsoleLayout.vue'

const allViews = import.meta.glob(`../views/**/**.vue`)
const importView = (filePath) => {
  return allViews[`../views/${filePath}.vue`]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: importView('Login'),
    },
    {
      path: '/',
      component: ConsoleLayout,
      children: [
        {
          path: '',
          component: importView('Home'),
        },
        {
          path: 'doc',
          component: importView('Doc'),
        },
        {
          path: 'room',
          component: importView('Room'),
        },
        {
          path: 'room-member/:wxid/:nickname',
          component: importView('RoomMember'),
        },
        {
          path: 'plugins/PingPong',
          component: importView('plugins/PingPong'),
        },
      ],
    },
    {
      path: '/arco',
      component: importView('Arco'),
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})

router.beforeEach((from, to, next) => {
  if (from.path === '/login') {
    next()
  } else if (localStorage.getItem('token')) {
    next()
  } else {
    next('/login')
  }
})
router.afterEach(() => {})

export default router
