<template>
  <div class="menu-container">
    <el-menu
      :default-active="($route.name as string)"
      :router="true"
      background-color="#2c3037"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <!-- 标题 -->
      <el-sub-menu index="0" class="menu-title-container" popper-class="menu-no-popper">
        <template #title>
          <div class="menu-title" @click="home">
            <span>{{ appStore.appConfig.name }}</span>
            <span>{{ appStore.appConfig.version }}</span>
          </div>
        </template>
      </el-sub-menu>

      <div class="menu-scroller">
        <MenuItem :menu-list="userStore.userInfo.menu"></MenuItem>
      </div>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import useAppStore from '../../store/modules/app';
import useUserStore from '../../store/modules/user';
import { routerPush } from '../../router';
import MenuItem from './MenuItem.vue';

const appStore = useAppStore()
const userStore = useUserStore()

const home = () => {
  routerPush('home')
}
</script>

<style lang="scss" scoped>
:deep(.el-menu-item),
:deep(.el-sub-menu) {
  user-select: none;
}

.menu-container {
  width: 260px;
  height: 100%;
  .el-menu {
    height: 100%;
    user-select: none;
    -webkit-user-select: none; 
    -moz-user-select: none; 
    -ms-user-select: none;
  }
  .menu-title-container {
    height: 60px;
    :deep(.el-sub-menu__title) {
      padding: 0 !important;
      height: 60px;
    }
    :deep(.el-sub-menu__icon-arrow) {
      display: none !important;
    }
    .menu-title {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 12px;
      // border-bottom: 1px solid rgba($color: #c3c3c3, $alpha: 0.1);
      span {
        line-height: normal;
      }
      span:nth-of-type(1) {
        font-size: 18px;
        letter-spacing: 1px;
      }
      span:nth-of-type(2) {
        text-align: right;
      }
    }
  }
  .menu-scroller {
    width: 100%;
    height: calc(100% - 60px);
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0px !important;
      height: 0px !important;
    }
    scrollbar-width: none !important;
  }
}
</style>