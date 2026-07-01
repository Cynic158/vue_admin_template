<template>
  <div class="app-container" style="width: 100%; height: 100%">
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
// 使用中文的element组件
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
const locale = zhCn;
</script>

<style scoped lang="scss">
.app-container {
  transform: translateZ(0);
}
</style>