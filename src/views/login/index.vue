<template>
  <div class="login-container router-ani">
    <div class="login-main-container">
      <div :class="['login-main', 'pwd', pwdPage ? 'show' : '']">
        <p class="login-title">修改密码</p>

        <el-form
          class="login-form"
          ref="pwdFormRef"
          :model="pwdParams"
          :rules="pwdRules"
        >
          <el-form-item prop="email">
            <el-input
              placeholder="请输入邮箱"
              v-model="pwdParams.email"
              clearable
              size="large"
              :prefix-icon="Message"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code" class="login-email">
            <el-input
              style="width: calc(100% - 76px);"
              placeholder="请输入验证码"
              v-model="pwdParams.code"
              clearable
              size="large"
              :prefix-icon="Key"
            ></el-input>
            <el-button
              :loading="userStore.emailCodeLoading"
              :disabled="userStore.emailCodeStart"
              @click="reqEmailCode(pwdParams.email)"
              type="primary"
              >{{
                !userStore.emailCodeStart ? "获取" : userStore.emailCodeCount
              }}</el-button
            >
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              show-password
              placeholder="请输入密码"
              v-model="pwdParams.password"
              clearable
              size="large"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>
          <el-form-item prop="confirmPwd">
            <el-input
              type="password"
              show-password
              placeholder="请输入确认密码"
              v-model="pwdParams.confirmPwd"
              clearable
              size="large"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="login-submit-btn" size="large" :loading="loading" @click="submitPwd" type="primary">修改密码</el-button>
          </el-form-item>

          <div class="login-btn-container">
            <div class="login-btn">
              <!-- 占位 -->
            </div>
            <div class="login-btn right">
              <el-button :disabled="loading" @click="showLogin" type="primary" link>{{ '登录 >' }}</el-button>
            </div>
          </div>
        </el-form>
      </div>

      <div :class="['login-main', 'login', loginPage ? 'show' : '']">
        <p class="login-name">VUE-ADMIN</p>
        <p class="login-title">登录</p>

        <el-form
          class="login-form"
          ref="formRef"
          :model="loginParams"
          :rules="rules"
        >
          <el-form-item prop="userName">
            <el-input
              placeholder="请输入用户名"
              v-model="loginParams.userName"
              clearable
              size="large"
              :prefix-icon="User"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              show-password
              placeholder="请输入密码"
              v-model="loginParams.password"
              clearable
              size="large"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="login-submit-btn" size="large" :loading="loading" @click="submitLogin" type="primary">登录</el-button>
          </el-form-item>

          <div class="login-btn-container">
            <div class="login-btn">
              <el-button :disabled="loading" @click="showPwd" type="primary" link>{{ '< 改密' }}</el-button>
            </div>
            <div class="login-btn right">
              <el-button :disabled="loading" @click="showReg" type="primary" link>{{ '注册 >' }}</el-button>
            </div>
          </div>
        </el-form>
      </div>

      <div :class="['login-main', 'reg', regPage ? 'show' : '']">
        <p class="login-title">注册</p>

        <el-form
          class="login-form"
          ref="regFormRef"
          :model="regParams"
          :rules="regRules"
        >
          <el-form-item prop="userName">
            <el-input
              placeholder="请输入用户名"
              v-model="regParams.userName"
              clearable
              size="large"
              :prefix-icon="User"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              show-password
              clearable
              placeholder="请输入密码"
              v-model="regParams.password"
              size="large"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>
          <el-form-item prop="confirmPwd">
            <el-input
              type="password"
              show-password
              clearable
              placeholder="请输入确认密码"
              v-model="regParams.confirmPwd"
              size="large"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="login-submit-btn" size="large" :loading="loading" @click="submitReg" type="primary">注册</el-button>
          </el-form-item>

          <div class="login-btn-container">
            <div class="login-btn">
              <el-button :disabled="loading" @click="showLogin" type="primary" link>{{ '< 登录' }}</el-button>
            </div>
            <div class="login-btn">
              <!-- 占位 -->
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import useUserStore from "../../store/modules/user";
import { routerPush } from "../../router";
import { User, Lock, Message, Key } from "@element-plus/icons-vue";
import { cloneDeep } from "lodash";
import REGEX from "../../utils/regexValue";

const userStore = useUserStore();

// 切换页面
const loginPage = ref(true);
const pwdPage = ref(false);
const regPage = ref(false);
const showLogin = () => {
  loginPage.value = true;
  pwdPage.value = false;
  regPage.value = false;
};
const showPwd = () => {
  loginPage.value = false;
  pwdPage.value = true;
  regPage.value = false;
};
const showReg = () => {
  loginPage.value = false;
  pwdPage.value = false;
  regPage.value = true;
};

// 统一处理加载
const loading = ref(false);

// 登录表单
const loginParams = ref<UserType_LoginRequest>({
  userName: "",
  password: "",
});
const formRef = ref<FormInstance>();
const rules: FormRules<UserType_LoginRequest> = {
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const submitLogin = async () => {
  if (!loading.value) {
    // 校验
    formRef.value?.validate(async (valid) => {
      if (valid) {
        try {
          loading.value = true;
          let res = await userStore.userLogin(cloneDeep(loginParams.value));
          if (res) {
            let res = await userStore.selectUserInfo();
            if (res) {
              // 获取用户信息成功，登入
              routerPush("home");
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
        }
      }
    });
  }
};

// 注册表单
interface UserRegType extends UserType_RegRequest {
  confirmPwd: string;
}
const regParams = ref<UserRegType>({
  userName: "",
  password: "",
  confirmPwd: "",
});
const validateRegPwd = (_rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入确认密码"));
  } else if (value != regParams.value.password) {
    callback(new Error("确认密码不一致"));
  } else {
    callback();
  }
};
const regFormRef = ref<FormInstance>();
const regRules: FormRules<UserRegType> = {
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPwd: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    { validator: validateRegPwd, trigger: "blur" },
  ],
};
const submitReg = async () => {
  if (!loading.value) {
    // 校验
    regFormRef.value?.validate(async (valid) => {
      if (valid) {
        try {
          loading.value = true;
          let res = await userStore.userReg(cloneDeep(regParams.value));
          if (res) {
            regParams.value = {
              userName: "",
              password: "",
              confirmPwd: "",
            };
            showLogin();
          }
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
        }
      }
    });
  }
};

// 获取验证码
const reqEmailCode = (email: string) => {
  if (email.length == 0) {
    ElMessage({
      type: "error",
      message: "邮箱不能为空",
    });
  } else if (!REGEX.email.test(email)) {
    ElMessage({
      type: "error",
      message: "邮箱格式有误",
    });
  } else {
    userStore.requestEmailCode(email);
  }
};

// 修改密码表单
interface UpdatePwdType extends UserType_PwdRequest {
  confirmPwd: string;
}
const pwdParams = ref<UpdatePwdType>({
  email: "",
  code: "",
  password: "",
  confirmPwd: "",
});
const validateEmail = (_rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入邮箱"));
  } else if (!REGEX.email.test(value)) {
    callback(new Error("邮箱格式不正确"));
  } else {
    callback();
  }
};
const validateCode = (_rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入验证码"));
  } else if (value.length != 6) {
    callback(new Error("验证码必须为6位"));
  } else {
    callback();
  }
};
const validatePwdPwd = (_rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请输入确认密码"));
  } else if (value != pwdParams.value.password) {
    callback(new Error("确认密码不一致"));
  } else {
    callback();
  }
};
const pwdFormRef = ref<FormInstance>();
const pwdRules: FormRules<UpdatePwdType> = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { validator: validateEmail, trigger: "blur" },
  ],
  code: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { validator: validateCode, trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPwd: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    { validator: validatePwdPwd, trigger: "blur" },
  ],
};
const submitPwd = async () => {
  if (!loading.value) {
    // 校验
    pwdFormRef.value?.validate(async (valid) => {
      if (valid) {
        try {
          loading.value = true;
          let res = await userStore.userPwd(cloneDeep(pwdParams.value));
          if (res) {
            pwdParams.value = {
              email: "",
              code: "",
              password: "",
              confirmPwd: "",
            };
            showLogin();
          }
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
        }
      }
    });
  }
};
</script>

<style scoped lang="scss">
:deep(.el-input__inner) {
  text-align: center;
  text-indent: -22px;
  font-size: 18px;
}
:deep(.el-form-item__error) {
  left: 50%;
  transform: translateX(-50%);
}
.login-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(to bottom, #409eff, #ffc9e2);
  .login-main-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 360px;
    height: 450px;
    border-radius: 8px;
    background-color: #f5f5f5;
    // box-shadow: 0 0 4px 4px rgba($color: #3e3e3e, $alpha: 0.1);
    // background-color: rgba($color: #ffffff, $alpha: 0.5);
    // backdrop-filter: blur(2px);
  }
  .login-main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    padding: 20px;
    &.login {
      z-index: 3;
    }
    &.pwd {
      z-index: 1;
      .login-title {
        margin-top: 8px !important;
        margin-bottom: 24px !important;
      }
      .login-submit-btn {
        margin-top: 16px !important;
      }
    }
    &.reg {
      z-index: 2;
      .login-title {
        margin-top: 24px !important;
      }
      .login-submit-btn {
        margin-top: 19px !important;
      }
    }
    opacity: 0;
    visibility: hidden;
    &.show {
      opacity: 1;
      visibility: visible;
    }
    transition: opacity 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    .login-name {
      margin-bottom: 20px;
      margin-top: 20px;
      font-size: 28px;
      font-weight: 600;
      color: #409eff;
      letter-spacing: 4px;
    }
    .login-title {
      margin-bottom: 40px;
      font-size: 24px;
      font-weight: 600;
      color: #409eff;
      letter-spacing: 4px;
    }
    .login-form {
      width: 100%;
      margin-bottom: 40px;
      .login-submit-btn {
        width: 100%;
        font-size: 16px;
        margin-top: 24px;
      }
      .login-email {
        :deep(.el-form-item__content) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .el-button {
            font-size: 16px;
            height: 38px;
          }
          .el-input__inner {
            text-indent: 52px;
          }
        }
      }
    }
    .login-btn-container {
      width: calc(100% - 40px);
      position: absolute;
      left: 20px;
      bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .login-btn {
        width: 60px;
        &.right {
          text-align: right;
        }
      }
    }
  }
}
</style>
