import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      guest: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Register.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/public-results",
    name: "PublicResults",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/PublicResults.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/public-cups",
    name: "PublicCups",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/PublicCups.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Dashboard.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/admin",
    name: "admin",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Admin.vue"),
    meta: {
      requiresAuth: true,
      is_admin: true,
    },
  },
  {
    path: "/feedback",
    name: "Feedback",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Feedback.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/continue",
    name: "ContinueComp",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ContinueComp.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/cup-overview",
    name: "CupOverview",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CupOverview.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/register-comp",
    name: "RegisterComp",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/RegisterComp.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/weighting",
    name: "Weighting",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Weighting.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/overview",
    name: "Overview",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Overview.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/comp-settings",
    name: "CompSettings",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CompSettings.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/results",
    name: "Results",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Results.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/signing",
    name: "Signing",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Signing.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

let router = new VueRouter({
  mode: "history",
  routes,
});

// Check auth before loading page
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
    } else {
      let user = JSON.parse(localStorage.getItem("user"));
      if (to.matched.some((record) => record.meta.is_admin)) {
        if (user.is_admin == true) {
          next();
        } else {
          // If token found, direct admin
          next({ name: "dashboard" });
        }
      } else {
        next();
      }
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (localStorage.getItem("jwt") == null) {
      // token not found
      next();
    } else {
      // If token found, direct guest to dashboard (e.g '/test')
      next({ name: "dashboard" });
    }
  } else {
    // If route doesn't match any page (e.g '/test')
    next({ name: "Home" });
  }
});

export default router;
