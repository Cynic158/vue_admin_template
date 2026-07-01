// 用户api
import requestApi from "../utils/request";

const userApi = {
  // 登录
  login: (params: UserType_LoginRequest) =>
    requestApi.post<string>("/user/login", params),
  // 注册
  reg: (params: UserType_RegRequest) =>
    requestApi.post<null>("/user/reg", params),
  // 修改密码
  pwd: (params: UserType_PwdRequest) => requestApi.post<null>("/user/pwd", params),
  // 获取验证码
  emailcode: (params: EmailCodeType_EmailCodeRequest) =>
    requestApi.post<null>("/user/emailcode", params),
  // 获取用户信息
  info: () => requestApi.get<UserType_InfoResponse>("/user/info", {}, 'other', {showSuccessMsg: false}),
  // 绑定邮箱
  bind: (params: UserType_BindRequest) => requestApi.post<null>("/user/bind", params),
};

export default userApi;
