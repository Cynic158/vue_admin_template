<template>
  <div class="layout-container">
    <el-container style="width: 100%;height: 100%;">
      <el-aside :class="{'collapse': appStore.menuCollapse}">
        <Menu></Menu>
      </el-aside>
      <el-container>
        <el-header style="padding: 0;">
          <Header></Header>
        </el-header>
        <el-main style="padding: 0;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue';
import Menu from './Menu.vue';
import useAppStore from '../../store/modules/app';

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f5f5f5;
  .el-aside {
    overflow: hidden;
    transition: width 0.3s;
    width: 260px;
    &.collapse {
      width: 0px;
    }
  }
}
</style>