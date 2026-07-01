<template>
  <el-dialog
    v-model="props.dialogParams.show"
    @close="handleHide"
    :title="props.dialogParams.title"
    :width="400"
    align-center
  >
    <p class="confirm-tip">{{ props.dialogParams.desc }}</p>
    <template #footer>
      <el-button @click="handleHide">取消</el-button>
      <el-button :loading="loading" type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  dialogParams: {
    title: string;
    desc: string;
    show: boolean;
    hide: () => void;
    val: any;
    api: (params: object) => Promise<RspType<any>>;
    callback: () => void;
  }
}>()

const loading = ref(false)
const confirm = async () => {
  try {
    loading.value = true
    let res = await props.dialogParams.api(props.dialogParams.val)
    if (res.success) {
      props.dialogParams.callback()
      props.dialogParams.hide()
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
const handleHide = () => {
  loading.value = false;
  props.dialogParams.hide();
}
</script>

<style lang="scss" scoped>
.confirm-tip {
  font-weight: 600;
}
</style>