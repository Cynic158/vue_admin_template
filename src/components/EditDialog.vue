<template>
  <el-dialog
    v-model="props.dialogParams.show"
    @close="handleHide"
    :title="dialogTitle"
    :width="dialogWidth"
    align-center
    :fullscreen="props.options?.fullscreen"
    :destroy-on-close="props.options?.destroyOnClose"
  >
    <el-form
      :model="formData"
      ref="formRef"
      :rules="formRules"
      label-width="auto"
      :validate-on-rule-change="false"
    >
      <FormItemGroup
        :select-options="props.selectOptions"
        :render-map="renderMap"
        :form-data="formData"
      ></FormItemGroup>
    </el-form>
    <template #footer>
      <el-button @click="handleHide">取消</el-button>
      <el-button @click="handleSubmit" type="primary" :loading="loading"
        >提交</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { cloneDeep } from "lodash";
import { isNumericString, validateJson } from "../utils";
import { ElMessage } from "element-plus";
import type { FormItemType, FormType } from "./editDialog";
import FormItemGroup from "./FormItemGroup.vue";

const props = defineProps<{
  // 常规参数
  dialogParams: {
    // 如果传入了formConfig的key，那么title会自动加新增或者更新前缀
    title?: string;
    // default兼具insert和update，必传formConfig.key
    // insert必传formConfig.insertApi
    // update必传formConfig.updateApi
    // other必传formConfig.submit
    type: "default" | "insert" | "update" | "other";
    show: boolean;
    hide: () => void;
  };
  // 额外参数
  options?: {
    width?: string;
    fullscreen?: boolean;
    destroyOnClose?: boolean;
  };
  // 初始值
  initVal: any;
  // 表单配置
  formConfig: {
    // default时判断是insert还是update的键(Id)，如果传入key，则必传insertApi与updateApi；不传入则为普通表单
    key?: Readonly<string>;
    formMap: Array<FormItemType>;
    // 如果初始值与表单配置有差异，可以传入转换函数
    initFormater?: (val: any) => FormType;
    // 如果传入值与提交值格式有差异，可以传入转换函数
    submitFormater?: (val: FormType) => any;
    submitValidator?: (val: FormType) => [boolean, string];
    insertApi?: Function;
    updateApi?: Function;
    submit?: Function;
    // 通常传入的是select，便于新增更新后执行刷新
    callback?: (response?: RspType<any>, submitData?: any) => void;
    // 是否在提交成功后保持对话框不关闭，适用于有返回报告
    keepDialog?: boolean;
  };
  selectOptions?: { [key: string]: Array<{ label: string; value: any }> };
}>();

const dialogWidth = computed(() => {
  return props.options?.width ? props.options.width : "500px";
});
const dialogTitle = computed(() => {
  if (props.dialogParams.title) {
    if (props.dialogParams.type == "default") {
      if (props.formConfig.key && formData.value[props.formConfig.key]) {
        return "更新" + props.dialogParams.title;
      } else {
        return "新增" + props.dialogParams.title;
      }
    } else if (props.dialogParams.type == "insert") {
      return "新增" + props.dialogParams.title;
    } else if (props.dialogParams.type == "update") {
      return "更新" + props.dialogParams.title;
    } else {
      return props.dialogParams.title;
    }
  } else {
    return undefined;
  }
});
const renderMap = computed(() => {
  return props.formConfig.formMap.filter((item) => !item.hidden);
});

const formData = ref<FormType>({});
const formRef = ref<FormInstance>();
const formRules = ref<FormRules<FormType>>({});

const generateFormRules = (formMap: Array<FormItemType>) => {
  let rules: FormRules<FormType> = {};
  formMap.forEach((item) => {
    if (item.hidden) {
      // 隐藏项不需要校验
    } else if (item.type == "button") {
      // 按钮项不需要校验
    } else if (item.type == "string" || item.type == "textarea") {
      if (item.required) {
        if (!item.inputConfig?.validator) {
          rules[item.key] = {
            required: true,
            message: "请输入" + item.label,
            trigger: "blur",
          };
        } else {
          rules[item.key] = [
            {
              required: true,
              message: "请输入" + item.label,
              trigger: "blur",
            },
            {
              validator: (_rule: any, value: string, callback: any) => {
                if (value == "") {
                  callback(new Error("请输入" + item.label));
                } else {
                  let validRes = item.inputConfig!.validator!(value);
                  if (validRes) {
                    callback();
                  } else {
                    callback(new Error("请输入有效值"));
                  }
                }
              },
              trigger: "blur",
            },
          ];
        }
      }
    } else if (item.type == "number") {
      if (item.required) {
        rules[item.key] = {
          required: true,
          message: "请输入" + item.label,
          trigger: "blur",
        };
      }
    } else if (item.type == "select") {
      if (item.required) {
        rules[item.key] = {
          required: true,
          message: "请选择" + item.label,
          trigger: "blur",
        };
      }
    } else if (item.type == "boolean") {
      // 不需要校验，布尔必定有值提交
    } else if (item.type == "numstr") {
      if (item.required) {
        rules[item.key] = [
          { required: true, message: "请输入" + item.label, trigger: "blur" },
          {
            validator: (_rule: any, value: string, callback: any) => {
              if (value == "") {
                callback(new Error("请输入" + item.label));
              } else {
                let validRes = isNumericString(value, item.numberStringConfig);
                if (validRes) {
                  callback();
                } else {
                  callback(new Error("请输入有效数值"));
                }
              }
            },
            trigger: "blur",
          },
        ];
      } else {
        rules[item.key] = [
          {
            validator: (_rule: any, value: string, callback: any) => {
              if (value == "") {
                callback();
              } else {
                let validRes = isNumericString(value, item.numberStringConfig);
                if (validRes) {
                  callback();
                } else {
                  callback(new Error("请输入有效数值"));
                }
              }
            },
            trigger: "blur",
          },
        ];
      }
    } else if (item.type == "json") {
      if (item.required) {
        rules[item.key] = [
          { required: true, message: "请输入" + item.label, trigger: "blur" },
          {
            validator: (_rule: any, value: string, callback: any) => {
              if (value == "") {
                callback(new Error("请输入" + item.label));
              } else {
                let validRes = validateJson(value);
                if (validRes) {
                  callback();
                } else {
                  callback(new Error("JSON格式有误"));
                }
              }
            },
            trigger: "blur",
          },
        ];
      } else {
        rules[item.key] = [
          {
            validator: (_rule: any, value: string, callback: any) => {
              if (value == "") {
                callback();
              } else {
                let validRes = validateJson(value);
                if (validRes) {
                  callback();
                } else {
                  callback(new Error("JSON格式有误"));
                }
              }
            },
            trigger: "blur",
          },
        ];
      }
    } else if (item.type == "file" || item.type == "image") {
      if (item.required) {
        rules[item.key] = [
          { required: true, message: "请上传" + item.label, trigger: "blur" },
          {
            validator: (_rule: any, value: string, callback: any) => {
              if (value == "") {
                callback(new Error("请上传" + item.label));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ];
      }
    } else if (item.type == "files" || item.type == "imgarr") {
      if (item.required) {
        rules[item.key] = [
          { required: true, message: "请上传" + item.label, trigger: "blur" },
          {
            validator: (_rule: any, value: Array<string>, callback: any) => {
              if (value.length == 0) {
                callback(new Error("请上传" + item.label));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ];
      }
    } else if (item.type == "code") {
      if (item.required) {
        rules[item.key] = [
          { required: true, message: "请输入" + item.label, trigger: "blur" },
          {
            validator: (_rule: any, value: string, callback: any) => {
              if (value.length == 0) {
                callback(new Error("请输入" + item.label));
              } else if (value.length != 6) {
                callback(new Error(item.label + "格式有误"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ];
      }
    } else if (item.type == "password") {
      if (!item.pwdConfig?.validator) {
        rules[item.key] = {
          required: true,
          message: "请输入" + item.label,
          trigger: "blur",
        };
      } else {
        rules[item.key] = [
          {
            required: true,
            message: "请输入" + item.label,
            trigger: "blur",
          },
          {
            validator: (_rule: any, value: string, callback: any) => {
              if (value == "") {
                callback(new Error("请输入" + item.label));
              } else {
                let validRes = item.pwdConfig!.validator!(value);
                if (validRes[0]) {
                  callback();
                } else {
                  callback(new Error(validRes[1]));
                }
              }
            },
            trigger: "blur",
          },
        ];
      }
    }
  });
  formRules.value = rules;
};
watch(
  () => props.dialogParams.show,
  (val) => {
    if (val) {
      let initVal = cloneDeep(props.initVal);
      if (props.formConfig.initFormater) {
        initVal = props.formConfig.initFormater(initVal);
      }
      // 赋值
      formData.value = initVal;
    }
  },
);
const updateFormVal = (key: string, val: any) => {
  formData.value[key] = cloneDeep(val)
}
defineExpose({
  updateFormVal
})
onMounted(() => {
  // 根据map创建校验
  generateFormRules(props.formConfig.formMap);
});

const loading = ref(false);
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        // 如果有复杂结构需要额外校验
        if (props.formConfig.submitValidator) {
          let validRes = props.formConfig.submitValidator(formData.value)
          if (!validRes[0]) {
            ElMessage({
              type: 'error',
              message: validRes[1],
            })
            return;
          }
        }

        loading.value = true;

        // 选取api
        let Api = props.formConfig.submit;
        if (props.dialogParams.type == "insert") {
          Api = props.formConfig.insertApi;
        } else if (props.dialogParams.type == "update") {
          Api = props.formConfig.updateApi;
        } else {
          if (props.formConfig.key) {
            if (formData.value[props.formConfig.key]) {
              Api = props.formConfig.updateApi;
            } else {
              Api = props.formConfig.insertApi;
            }
          }
        }

        // 对数据进行格式化
        let submitData = cloneDeep(formData.value);
        if (props.formConfig.submitFormater) {
          submitData = props.formConfig.submitFormater(submitData);
        }
        let res: RspType<any> = await Api!(submitData);
        if (res.success) {
          // 执行回调，并传入可能需要的数据
          if (props.formConfig.callback) {
            props.formConfig.callback(res, submitData);
          }
          // 关闭对话框
          if (!props.formConfig.keepDialog) {
            props.dialogParams.hide();
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    }
  });
};
const handleHide = () => {
  loading.value = false;
  formRef.value!.resetFields();
  props.dialogParams.hide();
};
</script>

<style lang="scss" scoped></style>
