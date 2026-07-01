<template>
  <div class="file-uploader-container">
    <input
      :id="inputId"
      type="file"
      :accept="acceptType"
      style="display: none"
      hidden
      @change="handleUpload"
    />

    <el-button
      type="primary"
      @click="handleClick"
      :loading="uploading"
      :disabled="props.uploadParams.disabled || uploadDisabled"
      >上传</el-button
    >

    <div
      class="file-uploader-item"
      v-for="(item, index) in fileUrlList"
      :key="index"
    >
      <el-tag type="primary">{{ getFileExt(item) }}</el-tag>
      <span class="file-uploader-item-name">{{ getFileName(item) }}</span>
      <el-icon @click="props.removeFile(index)" :size="20" color="#F56C6C"
        ><Close
      /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import type { FILE_TYPE } from "../utils/fileType";
import useAppStore from "../store/modules/app";
import { MIME_TYPE_MAP } from "../utils/fileType";
import { ElNotification } from "element-plus";
import { getFileSize, getFileExt, getFileName } from "../utils";
import appApi from "../api/app";
import { Close } from "@element-plus/icons-vue";

const props = defineProps<{
  uploadParams: {
    type: Array<FILE_TYPE>;
    limit?: number;
    maxSize?: number;
    api?: (formData: FormData) => Promise<RspType<string>>;
    url?: string;
    disabled?: boolean;
  };
  fileArr: Array<string>;
  insertFile: (url: string) => void;
  removeFile: (index?: number) => void;
}>();

const appStore = useAppStore();

// 防止多个文件上传组件同时存在导致input元素获取冲突
const inputId = ref("file-uploader-");

const acceptType = computed(() => {
  return props.uploadParams.type.map((item) => "." + item).join(",");
});
const fileUrlList = computed(() => {
  if (props.uploadParams.url) {
    return props.fileArr
      .filter((item) => item != "")
      .map((item) => props.uploadParams.url + item);
  } else {
    return props.fileArr
      .filter((item) => item != "")
      .map((item) => appStore.resourceUrl + item);
  }
});
const uploadDisabled = computed(() => {
  if (!props.uploadParams.limit) {
    if (fileUrlList.value.length == 0) {
      return false;
    } else {
      return true;
    }
  } else {
    if (fileUrlList.value.length < props.uploadParams.limit) {
      return false;
    } else {
      return true;
    }
  }
});

const uploading = ref(false);
const handleClick = () => {
  if (!uploading.value && !props.uploadParams.disabled) {
    const fileInput = document.getElementById(
      inputId.value,
    ) as HTMLInputElement;
    if (fileInput) {
      // 清空上一次的文件
      fileInput.value = "";
      fileInput.click();
    }
  }
};
// 加hover，改justify,button长度
const handleUpload = async (event: Event) => {
  try {
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      // 校验
      let acceptFileTypes = props.uploadParams.type.map(
        (type) => MIME_TYPE_MAP[type],
      );
      let fileSizeLimit = 10240000;
      if (props.uploadParams.maxSize) {
        fileSizeLimit = props.uploadParams.maxSize;
      }
      if (!acceptFileTypes.includes(file.type)) {
        ElNotification({
          title: "文件格式不符合要求",
          type: "warning",
        });
      } else if (file.size > fileSizeLimit) {
        ElNotification({
          title: "文件不能大于" + getFileSize(fileSizeLimit),
          type: "warning",
        });
      } else {
        // 上传
        uploading.value = true;
        let fd = new FormData();
        fd.append("file", file);
        let Api = appApi.uploadFile;
        if (props.uploadParams.api) {
          Api = props.uploadParams.api;
        }
        let res = await Api(fd);
        if (res.success) {
          props.insertFile(res.data);
        }
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    uploading.value = false;
  }
};

onMounted(() => {
  const instance = getCurrentInstance();
  const uid = instance?.uid ?? Date.now();
  inputId.value = "file-uploader-" + uid;
});
</script>

<style lang="scss" scoped>
.file-uploader-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  .file-uploader-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    width: 100%;
    .file-uploader-item-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: calc(100% - 100px);
    }
    .el-icon {
      cursor: pointer;
    }
  }
}
</style>
