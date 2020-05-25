import Vue from 'vue'
import vSelect from "vue-select";
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.component("v-select", vSelect);
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/continue',
    name: 'ContinueComp',
    component: () => import(/* webpackChunkName: "about" */ '../views/ContinueComp.vue')
  },
  {
    path: '/register-comp',
    name: 'RegisterComp',
    component: () => import(/* webpackChunkName: "about" */ '../views/RegisterComp.vue')
  },
  {
    path: '/weighting',
    name: 'Weighting',
    component: () => import(/* webpackChunkName: "about" */ '../views/Weighting.vue')
  },
  {
    path: '/overview',
    name: 'Overview',
    component: () => import(/* webpackChunkName: "about" */ '../views/Overview.vue')
  },
  {
    path: '/comp-settings',
    name: 'CompSettings',
    component: () => import(/* webpackChunkName: "about" */ '../views/CompSettings.vue')
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import(/* webpackChunkName: "about" */ '../views/Results.vue')
  },
  {
    path: '/signing',
    name: 'Signing',
    component: () => import(/* webpackChunkName: "about" */ '../views/Signing.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
