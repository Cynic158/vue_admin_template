<template>
  <div class="header-container">
    <EditDialog
      :dialog-params="{
        title: '绑定邮箱',
        type: 'other',
        show: bindEmailDialogBool,
        hide: hideBindEmailDialog,
      }"
      :init-val="bindEmailInitVal"
      :form-config="{
        formMap: bindEmailMap,
        submit: userApi.bind,
        callback: bindEmailCallback,
      }"
    ></EditDialog>
    <EditDialog
      :dialog-params="{
        title: '修改密码',
        type: 'other',
        show: updatePwdDialogBool,
        hide: hideUpdatePwdDialog,
      }"
      :init-val="updatePwdInitVal"
      :form-config="{
        formMap: updatePwdMap,
        submit: userApi.pwd,
      }"
    ></EditDialog>
    
    <!-- 导航栏左侧 -->
    <div class="header-container-left">
      <!-- 折叠菜单按钮 -->
      <div class="header-container-collapse clickable" @click="appStore.switchMenuCollapse">
        <el-icon :size="20" v-if="appStore.menuCollapse"><Expand /></el-icon>
        <el-icon :size="20" v-if="!appStore.menuCollapse"><Fold /></el-icon>
      </div>
    </div>
    <!-- 导航栏右侧 -->
    <div class="header-container-right">
      <el-avatar :size="30" :src="avatarUrl" />
      <el-text type="primary">{{ userStore.userInfo.userName }}</el-text>
      <el-popover :width="240">
        <template #reference>
          <el-icon class="clickable" :size="20"><Setting /></el-icon>
        </template>
        <template #default>
          <div style="display: flex;flex-direction: column;align-items: center;width: 100%;">
            <!-- 头像 -->
            <el-avatar style="margin-bottom: 8px;" :src="avatarUrl" />
            <!-- 用户名 -->
            <el-text style="font-size: 16px;" type="primary">{{ userStore.userInfo.userName }}</el-text>
            <!-- 角色 -->
            <div style="width: 100%;display: flex;flex-wrap: wrap;justify-content: center;">
              <el-tag style="margin: 4px 4px 2px 4px;" type="primary" v-for="(item, index) in userStore.userInfo.role" :key="index">{{ item }}</el-tag>
              <el-tag style="margin: 4px 4px 2px 4px;" v-if="userStore.userInfo.role.length == 0" type="info">无角色</el-tag>
            </div>
            <!-- 邮箱 -->
            <el-text v-if="userStore.userInfo.email != ''" style="margin: 8px 0;">{{ userStore.userInfo.email }}</el-text>
            <!-- 操作 -->
            <el-button style="width: 100%;margin: 0;margin-top: 4px;" text type="success" @click="showBindEmailDialog">绑定邮箱</el-button>
            <el-button style="width: 100%;margin: 0;" text type="warning" @click="showUpdatePwdDialog">修改密码</el-button>
            <el-button style="width: 100%;margin: 0;" text type="danger" @click="userStore.userLogout">退出登录</el-button>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAppStore from '../../store/modules/app';
import useUserStore from '../../store/modules/user';
import { Expand, Fold, Setting } from '@element-plus/icons-vue';
import avatarUrl from '../../assets/images/avatar.png';
import EditDialog from '../../components/EditDialog.vue';
import REGEX from '../../utils/regexValue';
import { ref } from 'vue';
import userApi from '../../api/user';
import type { FormItemType } from '../../components/editDialog';

const appStore = useAppStore()
const userStore = useUserStore()

// 邮箱绑定
const bindEmailMap: Array<FormItemType> = [
  {
    key: 'id',
    label: 'ID',
    type: 'number',
    required: true,
    hidden: true,
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'string',
    required: true,
    inputConfig: {
      validator: (email: string) => {
        return REGEX.email.test(email)
      }
    }
  },
  {
    key: 'code',
    label: '验证码',
    type: 'code',
    required: true,
    codeConfig: {
      bindKey: 'email'
    }
  },
]
const bindEmailDialogBool = ref(false)
const bindEmailInitVal = ref<UserType_BindRequest>({
  id: null,
  email: '',
  code: '',
})
const showBindEmailDialog = () => {
  bindEmailInitVal.value = {
    id: userStore.userInfo.id,
    email: userStore.userInfo.email,
    code: '',
  }
  bindEmailDialogBool.value = true
}
const hideBindEmailDialog = () => {
  bindEmailDialogBool.value = false
}
const bindEmailCallback = (_res: any, submitData: UserType_BindRequest) => {
  userStore.userInfo.email = submitData.email
}

// 修改密码
const updatePwdMap: Array<FormItemType> = [
  {
    key: 'email',
    label: '邮箱',
    type: 'string',
    required: true,
    inputConfig: {
      validator: (email: string) => {
        return REGEX.email.test(email)
      }
    }
  },
  {
    key: 'code',
    label: '验证码',
    type: 'code',
    required: true,
    codeConfig: {
      bindKey: 'email'
    }
  },
  {
    key: 'password',
    label: '新密码',
    type: 'password',
    required: true,
  },
]
const updatePwdDialogBool = ref(false)
const updatePwdInitVal = ref<UserType_PwdRequest>({
  email: '',
  code: '',
  password: ''
})
const showUpdatePwdDialog = () => {
  updatePwdInitVal.value = {
    email: userStore.userInfo.email,
    code: '',
    password: '',
  }
  updatePwdDialogBool.value = true
}
const hideUpdatePwdDialog = () => {
  updatePwdDialogBool.value = false
}
</script>

<style lang="scss" scoped>
.header-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #dcdfe6;
  .header-container-left {
    display: flex;
    align-items: center;
    .header-container-collapse {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #606266;
    }
  }
  .header-container-right {
    display: flex;
    align-items: center;
    .el-text {
      margin: 0 16px 0 10px;
      font-size: 16px;
    }
    .el-icon {
      color: #606266;
    }
  }
}
</style>