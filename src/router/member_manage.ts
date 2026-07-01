import type { RouteRecordRaw } from "vue-router";

const memberManageRoutes: Array<RouteRecordRaw> = [
  {
    // 会员管理
    path: "/member_manage",
    name: "member_manage",
    meta: {
      name: "会员管理",
    },
    redirect: { name: "member_list" },
    children: [
      {
        // 会员列表
        path: "/member_list",
        name: "member_list",
        meta: {
          name: "会员列表",
        },
        component: () => import("../views/modules/member_manage/member_list/index.vue")
      }
    ]
  }
]

export default memberManageRoutes