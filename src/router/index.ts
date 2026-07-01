import { createRouter, createWebHistory } from "vue-router";
import Routes from "./routes";
import useUserStore from "../store/modules/user";
import pinia from "../store/index";
import useNProgress from "./progress";

const { start, done } = useNProgress();

const router = createRouter({
  history: createWebHistory(),
  routes: Routes,
  // 切换路由即将页面重置
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

// 使用用户仓库的token
let userStore = useUserStore(pinia);

// 登录页->直接前往
// 非登录页->无token->返回登录页
// 非登录页->有token->无id->获取用户信息->获取失败->返回登录页
// 非登录页->有token->无id->获取用户信息->获取成功->判断权限
// 非登录页->有token->有id->判断权限->无权限->返回404
// 非登录页->有token->有id->判断权限->有权限->前往页面
router.beforeEach(async (to, _from, next) => {
  start();
  if (to.name == "login") {
    userStore.resetUserInfo();
    next();
  } else if (!userStore.token) {
    userStore.resetUserInfo();
    next({ name: "login" });
  } else if (!userStore.userInfo.id) {
    let infoRes = await userStore.selectUserInfo()
    if (!infoRes) {
      next({ name: "login" });
    } else {
      // 判断权限
      try {
        if (userStore.userRouter.includes(to.name as string)) {
          next();
        } else {
          next({ name: "404" });
        }
      } catch (error) {
        next({ name: "404" });
      }
    }
  } else {
    // 判断权限
    try {
      if (userStore.userRouter.includes(to.name as string)) {
        next();
      } else {
        next({ name: "404" });
      }
    } catch (error) {
      next({ name: "404" });
    }
  }
});
router.afterEach(() => {
  done();
});

// 路由跳转
export function routerPush(routeName: string) {
  router.push({ name: routeName });
}
// 路由替换
export function routerReplace(routeName: string) {
  router.replace({ name: routeName });
}

export default router;
