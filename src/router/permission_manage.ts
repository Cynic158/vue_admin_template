import type { RouteRecordRaw } from "vue-router";

const permissionManageRoutes: Array<RouteRecordRaw> = [
  {
    // 权限管理
    path: "/permission_manage",
    name: "permission_manage",
    meta: {
      name: "权限管理",
    },
    redirect: { name: "manager_list" },
    children: [
      {
        // 管理列表
        path: "/manager_list",
        name: "manager_list",
        meta: {
          name: "管理列表",
        },
        component: () => import("../views/modules/permission_manage/manager_list/index.vue")
      },
      {
        // 菜单配置
        path: "/menu_config",
        name: "menu_config",
        meta: {
          name: "菜单配置",
        },
        component: () => import("../views/modules/permission_manage/menu_config/index.vue")
      },
      {
        // 角色管理
        path: "/role_manage",
        name: "role_manage",
        meta: {
          name: "角色管理",
        },
        component: () => import("../views/modules/permission_manage/role_manage/index.vue")
      },
    ]
  }
]

export default permissionManageRoutes