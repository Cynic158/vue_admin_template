import axios from "axios";
import { ElMessage } from "element-plus";
import useUserStore from "../store/modules/user";
import useAppStore from "../store/modules/app";
import { routerPush } from "../router";

// 请求类型枚举
type RequestType = "select" | "insert" | "update" | "delete" | "other";
// 扩展请求配置
interface RequestOptions {
  showSuccessMsg?: boolean; // 是否显示成功提示
  cancelLoading?: boolean; // 是否取消loading
  checkParams?: boolean; // 是否检查并清理参数
}

//创建axios实例
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_BASE_API,
  timeout: 20000,
});

// 请求拦截
request.interceptors.request.use(
  (config) => {
    // 添加token
    let userStore = useUserStore();
    let token = userStore.token || "";
    config.headers.Authorization = "Bearer " + token;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截
request.interceptors.response.use(
  (response) => {
    if (!response.data.success) {
      ElMessage({
        type: "error",
        message: response.data.msg,
      });
    }
    if (response.data.msg == "token出错" || response.data.msg == "登录已过期") {
      // 清空用户信息，跳转到登录页
      let userStore = useUserStore();
      userStore.resetUserInfo();
      routerPush("login");
    }
    return response.data;
  },
  (error) => {
    ElMessage({
      type: "error",
      message: error.response.status + " 网络异常",
    });
    return Promise.reject(error);
  }
);

// 清理空参数（仅浅层）
const cleanEmptyParams = (params: any) => {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    // 非对象不处理
    return params;
  }
  Object.keys(params).forEach((key) => {
    const val = params[key];
    if (val === "" || val === null || val === undefined || (Array.isArray(val) && val.length === 0)) {
      delete params[key];
    }
  });
  return params;
};

// 通用请求方法封装
const requestWrapper = async <T>(
  method: "get" | "post",
  url: string,
  params: any = {},
  type: RequestType = "other",
  options: RequestOptions = {}
): Promise<RspType<T>> => {
  const appStore = useAppStore();
  const {
    showSuccessMsg = type !== "select", // select默认不显示成功提示，其他默认显示
    cancelLoading = false, // 默认不取消loading
    checkParams = type === "select", // select默认检查参数，其他默认不检查
  } = options;

  // 1. 处理参数清理
  const processedParams = checkParams ? cleanEmptyParams(params) : params;

  // 2. 处理loading
  let loadingKey: keyof typeof appStore | null = null;
  if (!cancelLoading) {
    switch (type) {
      case "select":
        loadingKey = "tableSelectLoading";
        break;
      case "insert":
        loadingKey = "tableInsertLoading";
        break;
      case "update":
        loadingKey = "tableUpdateLoading";
        break;
      case "delete":
        loadingKey = "tableDeleteLoading";
        break;
    }
    if (loadingKey) appStore[loadingKey] = true;
  }

  try {
    // 3. 发送请求
    let response: RspType<T>;
    if (method === "get") {
      response = await request.get(url, { params: processedParams });
    } else {
      response = await request[method](url, processedParams);
    }

    // 4. 处理成功提示
    if (showSuccessMsg && response.success) {
      let msg = response.msg;
      if (msg === "") {
        switch (type) {
          case "insert":
            msg = "新增成功";
            break;
          case "update":
            msg = "更新成功";
            break;
          case "delete":
            msg = "删除成功";
            break;
          default:
            msg = "操作成功";
        }
      }
      ElMessage({ type: "success", message: msg });
    }

    return response;
  } catch (error) {
    throw error;
  } finally {
    // 5. 关闭loading
    if (loadingKey && !cancelLoading) {
      appStore[loadingKey] = false;
    }
  }
};

// 暴露简化的请求方法（get/post/put/delete）
const requestApi = {
  get: <T>(url: string, params?: any, type: RequestType = "other", options?: RequestOptions) =>
    requestWrapper<T>("get", url, params, type, options),
  post: <T>(url: string, params?: any, type: RequestType = "other", options?: RequestOptions) =>
    requestWrapper<T>("post", url, params, type, options),
  // put: <T>(url: string, params?: any, type: RequestType = "update", options?: RequestOptions) =>
  //   requestWrapper<T>("put", url, params, type, options),
  // delete: <T>(url: string, params?: any, type: RequestType = "delete", options?: RequestOptions) =>
  //   requestWrapper<T>("delete", url, params, type, options),
};

export default requestApi;
