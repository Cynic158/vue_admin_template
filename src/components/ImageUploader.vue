<template>
  <div class="image-uploader-container">
    <input
      :id="inputId"
      type="file"
      :accept="acceptType"
      style="display: none"
      hidden
      @change="handleUpload"
    />

    <el-image-viewer
      :url-list="imageUrlList"
      show-progress
      :initial-index="previewIndex"
      v-if="showPreview"
      teleported
      @close="hidePreview"
    ></el-image-viewer>

    <div
      :style="{ width: listSize, height: listSize }"
      class="image-uploader-item"
      v-for="(item, index) in imageUrlList"
      :key="index"
    >
      <el-image
        style="width: 100%; height: 100%"
        :src="item"
        fit="cover"
      ></el-image>
      <div class="mask">
        <el-icon
          @click="zoomImage(index)"
          :size="20"
          color="#fff"
          style="margin-right: 12px"
        >
          <ZoomIn />
        </el-icon>
        <el-icon @click="props.removeImage(index)" :size="20" color="#fff">
          <Delete />
        </el-icon>
      </div>
    </div>

    <div
      v-if="showUpload"
      :style="{ width: listSize, height: listSize }"
      :class="{
        'image-uploader-item-upload': true,
        disabled: props.uploadParams.disabled,
      }"
      @click="handleClick"
    >
      <transition name="fade">
        <el-icon v-if="!uploading" color="#8c939d">
          <CameraFilled />
        </el-icon>
      </transition>
      <transition name="fade">
        <el-icon v-if="uploading" class="loading" color="#8c939d">
          <Loading />
        </el-icon>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import useAppStore from "../store/modules/app";
import { MIME_TYPE_MAP } from "../utils/fileType";
import type { IMAGE_TYPE } from "../utils/fileType";
import { ElNotification } from "element-plus";
import { getFileSize } from "../utils";
import appApi from "../api/app";
import { ZoomIn, Delete, CameraFilled, Loading } from "@element-plus/icons-vue";

const props = defineProps<{
  uploadParams: {
    type: Array<IMAGE_TYPE>;
    limit?: number;
    maxSize?: number;
    api?: (formData: FormData) => Promise<RspType<string>>;
    url?: string;
    listSize?: string;
    disabled?: boolean;
  };
  imageArr: Array<string>;
  insertImage: (url: string) => void;
  removeImage: (index?: number) => void;
}>();

const appStore = useAppStore();

// 防止多个图片上传组件同时存在导致input元素获取冲突
const inputId = ref("image-uploader-");

const previewIndex = ref(0);
const showPreview = ref(false);
const hidePreview = () => {
  showPreview.value = false;
};

const acceptType = computed(() => {
  return props.uploadParams.type.map((item) => "." + item).join(",");
});
const imageUrlList = computed(() => {
  if (props.uploadParams.url) {
    return props.imageArr
      .filter((item) => item != "")
      .map((item) => props.uploadParams.url + item);
  } else {
    return props.imageArr
      .filter((item) => item != "")
      .map((item) => appStore.resourceUrl + item);
  }
});
const showUpload = computed(() => {
  if (!props.uploadParams.limit) {
    if (imageUrlList.value.length == 0) {
      return true;
    } else {
      return false;
    }
  } else {
    if (imageUrlList.value.length < props.uploadParams.limit) {
      return true;
    } else {
      return false;
    }
  }
});
const listSize = computed(() => {
  if (props.uploadParams.listSize) {
    return props.uploadParams.listSize;
  } else {
    return "92px";
  }
});

const zoomImage = (index: number) => {
  previewIndex.value = index;
  showPreview.value = true;
};

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
        let Api = appApi.uploadImage;
        if (props.uploadParams.api) {
          Api = props.uploadParams.api;
        }
        let res = await Api(fd);
        if (res.success) {
          props.insertImage(res.data);
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
  inputId.value = "image-uploader-" + uid;
});
</script>

<style lang="scss" scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loading {
  animation: spin 1.5s infinite linear;
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  z-index: 2;
}
.image-uploader-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  .image-uploader-item {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    width: 92px;
    height: 92px;
    margin-right: 8px;
    margin-bottom: 8px;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
      .mask {
        opacity: 1;
      }
    }
    .mask {
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000, $alpha: 0.5);
      opacity: 0;
      transition: background-color 0.3s;
      position: absolute;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .image-uploader-item-upload {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px dashed var(--el-border-color-darker);
    background-color: var(--el-fill-color-lighter);
    width: 92px;
    height: 92px;
    margin-bottom: 8px;
    position: relative;
    &:hover {
      border: 1px dashed var(--el-color-primary);
    }
    cursor: pointer;
    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
      &:hover {
        border: 1px dashed var(--el-border-color-darker);
      }
    }
  }
}
</style>
