// 用户模块
import { defineStore } from "pinia";
import { handleToken } from "../../utils";
import sha256 from "sha256";
import userApi from "../../api/user";
import { computed, ref } from "vue";
import { routerReplace } from "../../router";
import { defaultRoutes } from "../../router/routes";
import { cloneDeep } from "lodash";

// name为中文名，所以应当提取path
const extractMenuPaths = (menus: UserMenuType[]): string[] => {
  // 无论如何都包含默认路由
  let paths = cloneDeep(defaultRoutes);
  
  menus.forEach(menu => {
    paths.push(menu.path);
    // 递归处理子菜单
    if (menu.children && menu.children.length > 0) {
      paths = paths.concat(extractMenuPaths(menu.children));
    }
  });
  
  return paths;
};

// 创建仓库
const useUserStore = defineStore("user", () => {
  const userInfo = ref<UserType>({
    id: 0,
    email: "",
    userName: "",
    manager: 0,
    role: [],
    menu: [],
  });
  const userRouter = computed(() => {
    // 对userInfo.menu进行降维并取url
    return extractMenuPaths(userInfo.value.menu);
  })
  // 用户token
  const token = ref(localStorage.getItem("VTK") || "");

  // 清除用户信息
  const resetUserInfo = () => {
    userInfo.value = {
      id: 0,
      email: "",
      userName: "",
      manager: 0,
      role: [],
      menu: [],
    };
    token.value = "";
    handleToken("set", "");
  };
  // 登出
  const userLogout = () => {
    resetUserInfo()
    routerReplace('login')
  }

  // 登录
  const userLogin = async (params: UserType_LoginRequest) => {
    try {
      params.password = sha256(params.password);
      let res = await userApi.login(params);
      if (res.success) {
        // 设置token
        token.value = res.data;
        handleToken("set", res.data);

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // 获取用户信息
  const selectUserInfo = async () => {
    try {
      let res = await userApi.info();
      if (res.success) {
        userInfo.value = res.data;
      }
      return res.success
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // 注册
  const userReg = async (params: UserType_RegRequest) => {
    try {
      params.password = sha256(params.password);
      let res = await userApi.reg(params);
      return res.success;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // 修改密码
  const userPwd = async (params: UserType_PwdRequest) => {
    try {
      params.password = sha256(params.password);
      let res = await userApi.pwd(params)
      return res.success;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // 验证码加载
  const emailCodeLoading = ref(false);
  const emailCodeStart = ref(false);
  const emailCodeCount = ref(60);
  const runCount = () => {
    let counter = setInterval(() => {
      emailCodeCount.value = emailCodeCount.value - 1;
      if (emailCodeCount.value == -1) {
        emailCodeStart.value = false;
        emailCodeCount.value = 60;
        clearInterval(counter);
      }
    }, 1000);
  };
  // 获取验证码
  const requestEmailCode = async (email: string) => {
    if (!emailCodeLoading.value && !emailCodeStart.value) {
      try {
        emailCodeLoading.value = true;
        let res = await userApi.emailcode({ email });
        if (res.success) {
          emailCodeStart.value = true;
          runCount();
        }
        return res.success;
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        emailCodeLoading.value = false;
      }
    }
  };

  return {
    userInfo,
    token,
    userRouter,
    resetUserInfo,
    userLogin,
    selectUserInfo,
    userReg,
    userPwd,
    emailCodeLoading,
    emailCodeStart,
    emailCodeCount,
    requestEmailCode,
    userLogout,
  };
});

export default useUserStore;
