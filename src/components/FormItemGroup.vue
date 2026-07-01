<template>
  <el-form-item
    v-for="item in props.renderMap"
    :key="item.key"
    :label="item.label + ':'"
    :label-width="props.labelWidth"
    :prop="item.key"
    :required="item.required"
  >
    <el-input-number
      style="width: 100%"
      v-if="item.type == 'number'"
      v-model="props.formData[item.key]"
      :min="item.numberConfig?.min"
      :max="item.numberConfig?.max"
      :precision="item.numberConfig?.precision"
      :disabled="
        item.disabledFunc ? item.disabledFunc(props.formData) : item.disabled
      "
      :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
      :controls="false"
      align="left"
      :disabled-scientific="true"
    ></el-input-number>

    <el-input
      v-else-if="item.type == 'string'"
      v-model="props.formData[item.key]"
      :disabled="
        item.disabledFunc ? item.disabledFunc(props.formData) : item.disabled
      "
      :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
      :maxlength="item.inputConfig?.maxlength"
      :show-word-limit="item.inputConfig?.showWordLimit"
      clearable
    ></el-input>

    <el-input
      v-else-if="item.type == 'numstr'"
      v-model="props.formData[item.key]"
      :disabled="
        item.disabledFunc ? item.disabledFunc(props.formData) : item.disabled
      "
      :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
      clearable
    ></el-input>

    <el-switch
      v-else-if="item.type == 'boolean'"
      v-model="props.formData[item.key]"
      :disabled="
        item.disabledFunc ? item.disabledFunc(props.formData) : item.disabled
      "
      inline-prompt
      :active-text="
        item.booleanConfig ? item.booleanConfig.trueLabel : undefined
      "
      :inactive-text="
        item.booleanConfig ? item.booleanConfig.falseLabel : undefined
      "
      :active-value="item.booleanConfig ? item.booleanConfig.trueVal : true"
      :inactive-value="item.booleanConfig ? item.booleanConfig.falseVal : false"
    ></el-switch>

    <el-input
      v-else-if="item.type == 'textarea'"
      v-model="props.formData[item.key]"
      type="textarea"
      :disabled="
        item.disabledFunc ? item.disabledFunc(props.formData) : item.disabled
      "
      :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
      :maxlength="item.inputConfig?.maxlength"
      :show-word-limit="item.inputConfig?.showWordLimit"
      :autosize="{
        minRows: item.textareaConfig ? item.textareaConfig.minRows : 2,
        maxRows: item.textareaConfig ? item.textareaConfig.maxRows : 4,
      }"
    ></el-input>

    <el-input
      v-else-if="item.type == 'json'"
      v-model="props.formData[item.key]"
      type="textarea"
      :disabled="
        item.disabledFunc ? item.disabledFunc(props.formData) : item.disabled
      "
      :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
      :autosize="{
        minRows: item.textareaConfig ? item.textareaConfig.minRows : 3,
        maxRows: item.textareaConfig ? item.textareaConfig.maxRows : 6,
      }"
    ></el-input>

    <el-select
      v-else-if="item.type == 'select'"
      v-model="props.formData[item.key]"
      :options="props.selectOptions![item.selectConfig!.optionsKey]"
      :disabled="
        item.disabledFunc ? item.disabledFunc(props.formData) : item.disabled
      "
      :placeholder="item.placeholder ? item.placeholder : '请选择' + item.label"
      :multiple="item.selectConfig?.multiple"
      :multiple-limit="item.selectConfig?.multipleLimit"
      :collapse-tags="item.selectConfig?.collapseTags"
      :max-collapse-tags="item.selectConfig?.maxCollapseTags"
      clearable
      fit-input-width
    ></el-select>

    <ImageUploader
      v-else-if="item.type == 'image'"
      :image-arr="[props.formData[item.key]]"
      :insert-image="
        (url: string) => {
          props.formData[item.key] = url;
        }
      "
      :remove-image="
        () => {
          props.formData[item.key] = '';
        }
      "
      :upload-params="{
        type: item.fileConfig!.type as Array<IMAGE_TYPE>,
        maxSize: item.fileConfig!.maxSize,
        api: item.fileConfig!.api,
        url: item.fileConfig!.url,
        listSize: item.fileConfig!.listSize,
        disabled: item.disabledFunc
          ? item.disabledFunc(props.formData)
          : item.disabled,
      }"
    ></ImageUploader>
    <ImageUploader
      v-else-if="item.type == 'imgarr'"
      :image-arr="props.formData[item.key]"
      :insert-image="
        (url: string) => {
          props.formData[item.key].push(url);
        }
      "
      :remove-image="
        (index?: number) => {
          props.formData[item.key].splice(index!, 1);
        }
      "
      :upload-params="{
        type: item.fileConfig!.type as Array<IMAGE_TYPE>,
        limit: item.fileConfig!.limit,
        maxSize: item.fileConfig!.maxSize,
        api: item.fileConfig!.api,
        url: item.fileConfig!.url,
        listSize: item.fileConfig!.listSize,
        disabled: item.disabledFunc
          ? item.disabledFunc(props.formData)
          : item.disabled,
      }"
    ></ImageUploader>

    <FileUploader
      v-else-if="item.type == 'file'"
      :file-arr="[props.formData[item.key]]"
      :insert-file="
        (url: string) => {
          props.formData[item.key] = url;
        }
      "
      :remove-file="
        () => {
          props.formData[item.key] = '';
        }
      "
      :upload-params="{
        type: item.fileConfig!.type,
        maxSize: item.fileConfig!.maxSize,
        api: item.fileConfig!.api,
        url: item.fileConfig!.url,
        disabled: item.disabledFunc
          ? item.disabledFunc(props.formData)
          : item.disabled,
      }"
    ></FileUploader>
    <FileUploader
      v-else-if="item.type == 'files'"
      :file-arr="props.formData[item.key]"
      :insert-file="
        (url: string) => {
          props.formData[item.key].push(url);
        }
      "
      :remove-file="
        (index?: number) => {
          props.formData[item.key].splice(index!, 1);
        }
      "
      :upload-params="{
        type: item.fileConfig!.type,
        limit: item.fileConfig!.limit,
        maxSize: item.fileConfig!.maxSize,
        api: item.fileConfig!.api,
        url: item.fileConfig!.url,
        disabled: item.disabledFunc
          ? item.disabledFunc(props.formData)
          : item.disabled,
      }"
    ></FileUploader>

    <div class="code-input" v-else-if="item.type == 'code'">
      <el-input
        style="width: calc(100% - 80px)"
        v-model="props.formData[item.key]"
        :disabled="
          item.disabledFunc ? item.disabledFunc(props.formData) : item.disabled
        "
        :placeholder="
          item.placeholder ? item.placeholder : '请输入' + item.label
        "
        clearable
      ></el-input>
      <el-button
        :loading="userStore.emailCodeLoading"
        :disabled="userStore.emailCodeStart"
        @click="reqEmailCode(item.codeConfig!.bindKey)"
        type="primary"
        >{{
          !userStore.emailCodeStart ? "获取" : userStore.emailCodeCount
        }}</el-button
      >
    </div>

    <el-input
      v-else-if="item.type == 'password'"
      v-model="props.formData[item.key]"
      type="password"
      show-password
      :disabled="
        item.disabledFunc ? item.disabledFunc(props.formData) : item.disabled
      "
      :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
      clearable
    ></el-input>

    <el-button
      v-else-if="item.type == 'button'"
      :type="item.buttonConfig?.type"
      @click="item.buttonConfig?.action(props.formData)"
      :disabled="
        item.disabledFunc ? item.disabledFunc(props.formData) : item.disabled
      ">{{ item.buttonConfig?.title }}</el-button>

    <el-collapse
      expand-icon-position="left"
      style="width: 100%"
      v-else-if="item.type == 'array'"
    >
      <el-collapse-item>
        <div
          v-if="
            Array.isArray(props.formData[item.key]) &&
            props.formData[item.key].length == 0
          "
          class="form-item-null"
        >
          暂无数据
        </div>

        <el-card
          style="margin-bottom: 8px"
          shadow="hover"
          v-for="(_arrItem, arrIndex) in props.formData[item.key]"
          :key="arrIndex"
        >
          <FormItemGroup
            :select-options="props.selectOptions"
            :render-map="item.arrayConfig!.arrMap"
            :label-width="item.arrayConfig!.labelWidth"
            :form-data="props.formData[item.key][arrIndex]"
          ></FormItemGroup>

          <div class="form-item-btn-container">
            <el-button
              @click="
                () => {
                  props.formData[item.key].splice(arrIndex, 1);
                }
              "
              type="danger"
              size="small"
              :icon="Delete"
            ></el-button>
          </div>
        </el-card>

        <div class="form-item-btn-container">
          <el-button
            @click="
              () => {
                props.formData[item.key].push(item.arrayConfig!.insertVal);
              }
            "
            type="success"
            size="small"
            :icon="Plus"
          ></el-button>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-card
      style="margin-bottom: 12px; width: 100%"
      shadow="hover"
      v-else-if="item.type == 'object'"
    >
      <div
        v-if="
          Array.isArray(props.formData[item.key]) &&
          props.formData[item.key].length == 0
        "
        class="form-item-null"
      >
        暂无数据
      </div>

      <div
        class="form-item-object-container"
        v-for="(_arrItem, arrIndex) in props.formData[item.key]"
        :key="arrIndex"
      >
        <el-form-item
          label-width="40px"
          label="键"
          style="width: calc(50% - 50px)"
        >
          <el-input
            v-model="props.formData[item.key][arrIndex][0]"
            placeholder="请输入键"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          label-width="40px"
          label="值"
          style="width: calc(50% - 50px)"
        >
          <el-input-number
            style="width: 100%"
            v-if="item.objectConfig!.valType.type == 'number'"
            v-model="props.formData[item.key][arrIndex][1]"
            :min="item.objectConfig!.valType.numberConfig?.min"
            :max="item.objectConfig!.valType.numberConfig?.max"
            :precision="item.objectConfig!.valType.numberConfig?.precision"
            :disabled="item.objectConfig!.valType.disabled"
            placeholder="请输入值"
            :controls="false"
            align="left"
            :disabled-scientific="true"
          ></el-input-number>

          <el-input
            v-else-if="item.objectConfig!.valType.type == 'string'"
            v-model="props.formData[item.key][arrIndex][1]"
            :disabled="item.objectConfig!.valType.disabled"
            placeholder="请输入值"
            :maxlength="item.objectConfig!.valType.inputConfig?.maxlength"
            :show-word-limit="
              item.objectConfig!.valType.inputConfig?.showWordLimit
            "
            clearable
          ></el-input>

          <el-input
            v-else-if="item.objectConfig!.valType.type == 'numstr'"
            v-model="props.formData[item.key][arrIndex][1]"
            :disabled="item.objectConfig!.valType.disabled"
            placeholder="请输入值"
            clearable
          ></el-input>
        </el-form-item>

        <el-button
          @click="
            () => {
              props.formData[item.key].splice(arrIndex, 1);
            }
          "
          type="danger"
          size="small"
          :icon="Delete"
        ></el-button>
      </div>

      <div class="form-item-btn-container">
        <el-button
          @click="
            () => {
              props.formData[item.key].push(['', item.objectConfig!.insertVal]);
            }
          "
          type="success"
          size="small"
          :icon="Plus"
        ></el-button>
      </div>
    </el-card>
  </el-form-item>
</template>

<script setup lang="ts">
import type { FormItemType, FormType } from "./editDialog";
import type { IMAGE_TYPE } from "../utils/fileType";
import ImageUploader from "./ImageUploader.vue";
import FileUploader from "./FileUploader.vue";
import { Delete, Plus } from "@element-plus/icons-vue";
import useUserStore from "../store/modules/user";
import { ElMessage } from "element-plus";
import REGEX from "../utils/regexValue";

const props = defineProps<{
  selectOptions?: { [key: string]: Array<{ label: string; value: any }> };
  renderMap: Array<FormItemType>;
  labelWidth?: string;
  formData: FormType;
}>();

const userStore = useUserStore();

// code-验证码部分
const reqEmailCode = (key: string) => {
  let email: string = props.formData.value[key];
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
</script>
<script lang="ts">
export default {
  name: "FormItemGroup",
};
</script>

<style lang="scss" scoped>
.code-input {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.form-item-null {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #c0c0c0;
}
.form-item-btn-container {
  display: flex;
  align-items: center;
  justify-content: right;
  width: 100%;
}
.form-item-object-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
}
</style>
