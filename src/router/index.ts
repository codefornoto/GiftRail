import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import MapView from '../views/MapView.vue'
import type { RouteLocationNormalized } from 'vue-router'
import TopView from '@/views/TopView.vue'

const getProps = (route: RouteLocationNormalized) => ({
  mode: route.query.mode,
  id: route.query.id,
  zoom: 15,
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'top',
      component: TopView,
      props: getProps,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      props: getProps,
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
      props: getProps,
    },
  ],
})

export default router
