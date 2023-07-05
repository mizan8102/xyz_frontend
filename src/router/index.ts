// Composables
import { createRouter, createWebHistory } from 'vue-router'
import EntryPage from '../views/EntryView.vue';
import Resultview from '../views/ResultView.vue';
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'resultView',
        component: Resultview,
      },
      {
        path: 'entry',
        name: 'entryView',
        component: EntryPage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
