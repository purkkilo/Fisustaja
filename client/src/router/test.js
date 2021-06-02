import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Parse from "parse";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Energiahoyla - Kotisivu" },
  },
  {
    path: "/login",
    name: "Login",
    // route level code-splitting
    component: () => import("@/views/Login.vue"),
    meta: { title: "Energiahoyla - Login" },
  },
  {
    path: "/admin",
    name: "Admin",
    // route level code-splitting
    component: () => import("@/views/Admin.vue"),
    meta: {
      title: "Energiahoyla - Admin",
      requiresAuth: true,
      adminAuth: true,
    },
  },
  {
    path: "/select-place",
    name: "SelectPlace",
    // route level code-splitting
    component: () => import("@/views/SelectPlace.vue"),
    meta: {
      title: "Energiahoyla - Valitse Paikka",
      requiresAuth: true,
      adminAuth: false,
    },
  },
  {
    path: "/summary",
    name: "EnergySummary",
    // route level code-splitting
    component: () => import("@/views/EnergySummary.vue"),
    meta: {
      title: "Energiahoyla - Paikan Yhteenveto",
      requiresAuth: true,
      adminAuth: false,
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/About.vue"),
    meta: { title: "Energiahoyla - About" },
  },
  {
    name: "404",
    path: "/404",
    // route level code-splitting
    component: () => import("@/views/NotFound.vue"),
    meta: { title: "Energiahoyla - Not Found" },
  },
  {
    path: "*",
    redirect: "404",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

const DEFAULT_TITLE = "Energiahoyla";

//Login

router.beforeEach((to, from, next) => {
  // Check for protected route
  if (to.meta.requiresAuth) {
    let authUser = JSON.parse(localStorage.getItem("user"));
    if (Parse.User.current()) {
      authUser = Parse.User.current().attributes;
    }
    if (!authUser) {
      if (from.name !== "Login") {
        router.push({ name: "Login" });
      }
    } else {
      if (to.meta.adminAuth) {
        if (authUser.role === "admin") {
          next();
        } else {
          router.push({ name: "404" });
        }
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

/* eslint-disable no-unused-vars */
router.afterEach((to, from) => {
  // Use next tick to handle router history correctly
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;
