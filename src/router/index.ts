import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import MapView from '../views/MapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      props: (route) => ({ mode: route.query.mode, id: route.query.id }),
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
      props: (route) => ({ mode: route.query.mode, id: route.query.id }),
    },
  ],
})

export default router
