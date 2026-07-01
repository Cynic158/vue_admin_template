<template>
  <div>
    <template v-for="item in props.menuList" :key="item.path">
      <!-- 无子节点 -->
      <el-menu-item
        v-if="!item.children"
        :index="item.path"
      >
        <!-- 需要全局注册所有icon -->
        <!-- <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon> -->
        <span>{{ item.meta?.name || item.name }}</span>
      </el-menu-item>

      <!-- 有子节点 -->
      <el-sub-menu
        v-else
        :index="item.path"
      >
        <template #title>
          <!-- 需要全局注册所有icon -->
          <!-- <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon> -->
          <span>{{ item.meta?.name || item.name }}</span>
        </template>
        <MenuItem :menu-list="item.children"></MenuItem>
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  menuList: Array<UserMenuType>
}>()
</script>
<script lang="ts">
export default {
  name: "MenuItem",
};
</script>

<style lang="scss" scoped></style>