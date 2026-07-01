import type { RouteRecordRaw } from "vue-router";
import memberManageRoutes from "./member_manage";
import permissionManageRoutes from "./permission_manage";

const Routes: Array<RouteRecordRaw> = [
  {
    // 登录页
    path: "/login",
    name: "login",
    meta: {
      name: "登录",
    },
    component: () => import("../views/login/index.vue"),
  },
  {
    // 主页
    path: "/",
    name: "layout",
    meta: {
      name: "界面",
    },
    component: () => import("../views/layout/index.vue"),
    redirect: { name: "home" },
    children: [
      {
        // 首页
        path: "home",
        name: "home",
        meta: {
          name: "首页",
        },
        component: () => import("../views/home/index.vue"),
      },
      // 其他页面
      // 会员管理
      ...memberManageRoutes,
      // 权限管理
      ...permissionManageRoutes,
    ]
  },
  {
    // 404
    path: "/:pathMatch(.*)*",
    name: "404",
    meta: {
      name: "404",
    },
    component: () => import("../views/404/index.vue")
  },
]

export const defaultRoutes = ['login', 'layout', 'home', '404'];

export default Routes;