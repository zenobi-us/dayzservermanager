import { createMemoryHistory, createRouter } from 'vue-router'

import DashboardView from './views/DashboardView.vue'
import ServersView from './views/ServersView.vue'
import ServerDetailsView from './views/ServerDetailsView.vue'
import ServerListView from './views/ServerListView.vue'
import GlobalModsView from './views/GlobalModsView.vue'

const routes = [
  { path: '/', component: DashboardView },
  {
    path: '/servers', component: ServersView,
    children: [
      { path: '/', component: ServerListView },
      { path: ':id', component: ServerDetailsView },
    ]
  },
  { path: '/mods', component: GlobalModsView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})