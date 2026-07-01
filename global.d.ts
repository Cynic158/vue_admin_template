import { IMAGE_TYPE, FILE_TYPE } from "./src/utils/fileType";

declare global {
  // 通用响应体
  interface RspType<T> {
    success: boolean;
    msg: string;
    data: T;
  }
  // 通用表格返回
  interface TableRspType<T> {
    total: number;
    data: Array<T>
  }
  // 布尔 0false1true
  type BooleanType = 0 | 1;
  // 通用计时器
  type TimerType = number | null;
  type MomentFormatType = 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD' | 'YYYY-MM' | 'YYYY';
  // 表单配置
  interface NumberStringOptionsType {
    allowNegative?: boolean;   // 是否允许负数
    allowDecimal?: boolean;    // 是否允许小数
    allowPercent?: boolean;    // 是否允许百分比
    allowZero?: boolean;       // 是否允许值为0
  }

  // ------------------------------

  // 验证码表
  interface EmailCodeType {
    id: number;
    email: string;
    code: string;
    time: number;
  }
  // 接口
  // 获取验证码
  interface EmailCodeType_EmailCodeRequest {
    email: string;
  }

  // 用户
  // 用户表
  interface UserMenuType {
    name: string;
    path: string;
    meta: {
      name: string;
      icon?: string;
    };
    children?: Array<UserMenuType>;
  }
  interface UserType {
    id: number;
    email: string;
    userName: string;
    manager: BooleanType;
    role: Array<string>;
    menu: Array<UserMenuType>;
  }
  // 登录
  interface UserType_LoginRequest {
    userName: string;
    password: string;
  }
  // 注册
  interface UserType_RegRequest {
    userName: string;
    password: string;
  }
  // 修改密码
  interface UserType_PwdRequest {
    email: string;
    code: string;
    password: string;
  }
  // 绑定邮箱
  interface UserType_BindRequest {
    id: number | null;
    email: string;
    code: string;
  }
  // 获取用户信息
  type UserType_InfoResponse = UserType;

  interface MenuType {
    id: number;
    parentId: number;
    enable: BooleanType;
    sort: number;
    name: string;
    path: string;
  }
  interface MenuTreeType {
    label: string;
    children?: Array<MenuTreeType>;
  }
  interface RoleMenuTreeType {
    label: string;
    id: number;
    children?: Array<MenuTreeType>;
  }
}

export {};
