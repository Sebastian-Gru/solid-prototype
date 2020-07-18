const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // { path: '', component: () => import('pages/Feed.vue'), meta: {tabs: true} },
      {
        path: "/",
        component: () => import("pages/PageUsers.vue"),
        meta: { tabs: true },
      },
      {
        path: "/chat",
        component: () => import("pages/ChatPage.vue"),
        meta: { back: true },
      },
      {
        path: "/profile",
        component: () => import("pages/Profile.vue"),
        meta: { tabs: true },
      },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue"),
  });
}

export default routes;
