import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import("../views/Login.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import("../views/Register.vue"),
    meta: {
      requiresAuth: true,
      is_admin: true,
    },
  },
  {
    path: "/public-results",
    name: "PublicResults",
    component: () =>
      import("../views/PublicResults.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/public-cups",
    name: "PublicCups",
    component: () =>
      import("../views/PublicCups.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () =>
      import("../views/Dashboard.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/admin",
    name: "admin",
    component: () =>
      import("../views/Admin.vue"),
    meta: {
      requiresAuth: true,
      is_admin: true,
    },
  },
  {
    path: "/cup-overview",
    name: "CupOverview",
    component: () =>
      import("../views/CupOverview.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/register-comp",
    name: "CreateComp",
    component: () =>
      import("../views/CreateComp.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/weighting",
    name: "Weighting",
    component: () =>
      import("../views/Weighting.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/overview",
    name: "Overview",
    component: () =>
      import("../views/Overview.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/comp-settings",
    name: "CompSettings",
    component: () =>
      import("../views/CompSettings.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/results",
    name: "Results",
    component: () =>
      import("../views/Results.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/signing",
    name: "Signing",
    component: () =>
      import("../views/Signing.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: "404",
    path: "/404",
    // route level code-splitting
    component: () =>
      import("../views/NotFound.vue"),
    meta: { title: "Not Found" },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "404" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Check auth before loading page
router.beforeEach((to) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    return true;
  }
  if (
    localStorage.getItem("jwt") == null ||
    localStorage.getItem("user") == null
  ) {
    return { path: "/login" };
  }
  const isAdmin = JSON.parse(localStorage.getItem("auth"));
  if (to.matched.some((record) => record.meta.is_admin) && !isAdmin) {
    return { name: "404" };
  }
  return true;
});

export default router;
