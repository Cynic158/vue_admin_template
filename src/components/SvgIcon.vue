<template>
  <div
    :style="{
      width: svgSize ? svgSize : '16px',
      height: svgSize ? svgSize : '16px',
    }"
    class="svgicon-container"
    @click="
      (e) => {
        if (props.clickFunc) {
          e.stopPropagation();
          props.clickFunc();
        }
      }
    "
  >
    <svg
      :style="{
        width: svgSize ? svgSize : '16px',
        height: svgSize ? svgSize : '16px',
      }"
    >
      <use
        :xlink:href="`#icon-${props.svgName}`"
        :fill="color ? color : '#909399'"
      ></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  svgName: string;
  svgSize?: string;
  color?: string;
  clickFunc?: Function;
}>();
</script>

<style lang="scss" scoped>
.svgicon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
