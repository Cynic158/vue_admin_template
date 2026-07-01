<template>
  <div class="page-container">
    <EditDialog
      :dialog-params="{
        title: '会员',
        type: 'default',
        show: editDialogBool,
        hide: hideEditDialog,
      }"
      :init-val="editInitVal",
      :form-config="{
        key: 'id',
        formMap: editFormMap,
        insertApi: memberListApi.insert,
        updateApi: memberListApi.update,
        callback: callbackSelect,
      }"
      :select-options="selectOptions"
    ></EditDialog>
    <MixTable
      ref="tableRef"
      :select-config="selectConfig"
      :select-options="selectOptions"
      :table-options="{
        selectApi: memberListApi.select,
        showInsert: insert,
        showUpdate: update,
        rowsConfig: tableRowsConfig,
        hideRowsBool: ['idCardHide']
      }"
    ></MixTable>
  </div>
</template>

<script setup lang="ts">
import MixTable from '../../../../components/MixTable.vue';
import EditDialog from '../../../../components/EditDialog.vue';
import type { SelectConfigType, TableRowsType } from '../../../../components/mixTable';
import type { FormItemType } from '../../../../components/editDialog';
import { ref } from 'vue';
import memberListApi from '../../../../api/member_manage/member_list';

const selectOptions = ref({
  enable: [
    {
      label: '启用',
      value: 1,
    },
    {
      label: '禁用',
      value: 0,
    },
  ],
  gender: [
    {
      label: '男',
      value: 1,
    },
    {
      label: '女',
      value: 0,
    },
  ],
  client: [
    {
      label: 'WEB',
      value: 'web',
    },
    {
      label: 'IOS',
      value: 'ios',
    },
    {
      label: 'ANDROID',
      value: 'android',
    },
  ]
});

const selectConfig: Array<SelectConfigType> = [
  {
    key: 'id',
    label: '会员ID',
    type: 'number',
    numberConfig: {
      min: 1,
      precision: 0,
    }
  },
  {
    key: 'account',
    label: '会员账号',
    type: 'number',
    numberConfig: {
      min: 1,
      precision: 0,
    }
  },
  {
    key: 'name',
    label: '会员昵称',
    type: 'string',
  },
  {
    key: 'phoneNumber',
    label: '手机号码',
    type: 'string',
  },
  {
    key: 'enable',
    label: '是否启用',
    type: 'select',
    selectConfig: {
      optionsKey: 'enable',
    },
  },
]
const tableRowsConfig: Array<TableRowsType> = [
  {
    name: 'ID',
    key: 'id',
    width: '120',
  },
  {
    name: '会员昵称',
    key: 'name',
    width: '180',
    overflow: true,
  },
  {
    name: '真实名称',
    key: 'realName',
    width: '180',
    overflow: true,
  },
  {
    name: '头像',
    key: 'avatar',
    width: '100',
    type: 'image',
    imageSize: [60, 60],
  },
  {
    name: '会员账号',
    key: 'account',
    width: '180',
    overflow: true,
  },
  {
    name: '邮箱',
    key: 'email',
    width: '200',
    overflow: true,
  },
  {
    name: '电话号码',
    key: 'phoneNumber',
    width: '200',
    overflow: true,
  },
  {
    name: '手机型号',
    key: 'phoneModel',
    width: '200',
    overflow: true,
  },
  {
    name: '身份证',
    key: 'idCard',
    width: '240',
    type: 'hide',
    hideKey: 'idCardHide',
  },
  {
    name: 'IP',
    key: 'ip',
    width: '180',
    overflow: true,
  },
  {
    name: '客户端',
    key: 'client',
    width: '180',
    overflow: true,
  },
  {
    name: '地址',
    key: 'address',
    width: '180',
    overflow: true,
  },
  {
    name: '性别',
    key: 'gender',
    width: '120',
    format: (row, _index) => {
      return selectOptions.value.gender.find((item) => item.value == row.gender)?.label || row.gender
    },
  },
  {
    name: '是否启用',
    key: 'enable',
    width: '120',
    format: (row, _index) => {
      return selectOptions.value.enable.find((item) => item.value == row.enable)?.label || row.enable;
    },
  },
  {
    type: 'time',
    name: '创建时间',
    key: 'createAt',
    width: '180',
  },
  {
    type: 'time',
    name: '更新时间',
    key: 'updateAt',
    width: '180',
  },
  {
    type: 'option',
    name: '操作',
    key: '',
    width: '150',
  },
]

const editInitVal = ref({
  name: '',
  realName: '',
  avatar: '',
  account: null,
  email: '',
  phoneNumber: '',
  phoneModel: '',
  idCard: '',
  ip: '',
  client: '',
  address: '',
  gender: 1,
  enable: 1,
});
const editFormMap: Array<FormItemType> = [
  {
    key: 'id',
    label: '',
    type: 'number',
    required: true,
    placeholder: '',
    hidden: true,
  },
  {
    key: 'name',
    label: '会员昵称',
    type: 'string',
    required: true,
  },
  {
    key: 'realName',
    label: '真实名称',
    type: 'string',
    required: true,
  },
  {
    key: 'avatar',
    label: '头像',
    type: 'image',
    required: true,
    fileConfig: {
      type: ['png', 'jpg', 'jpeg'],
    },
  },
  {
    key: 'account',
    label: '会员账号',
    type: 'number',
    required: true,
    numberConfig: {
      min: 1,
      precision: 0,
    },
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'string',
    required: true,
  },
  {
    key: 'phoneNumber',
    label: '电话号码',
    type: 'string',
    required: true,
  },
  {
    key: 'phoneModel',
    label: '手机型号',
    type: 'string',
    required: true,
  },
  {
    key: 'idCard',
    label: '身份证号',
    type: 'string',
    required: true,
  },
  {
    key: 'ip',
    label: 'IP',
    type: 'string',
    required: true,
  },
  {
    key: 'client',
    label: '客户端',
    type: 'select',
    required: true,
    selectConfig: {
      optionsKey: 'client'
    },
  },
  {
    key: 'address',
    label: '地址',
    type: 'textarea',
    required: true,
    textareaConfig: {
      minRows: 2,
      maxRows: 4,
    },
  },
  {
    key: 'gender',
    label: '性别',
    type: 'boolean',
    required: true,
    booleanConfig: {
      falseLabel: '女',
      trueLabel: '男',
      falseVal: 0,
      trueVal: 1,
    },
  },
  {
    key: 'enable',
    label: '是否启用',
    type: 'boolean',
    required: true,
    booleanConfig: {
      falseLabel: '禁用',
      trueLabel: '启用',
      falseVal: 0,
      trueVal: 1,
    },
  },
]

const editDialogBool = ref(false);
const hideEditDialog = () => {
  editDialogBool.value = false;
}
const insert = () => {
  editInitVal.value = {
    name: '',
    realName: '',
    avatar: '',
    account: null,
    email: '',
    phoneNumber: '',
    phoneModel: '',
    idCard: '',
    ip: '',
    client: '',
    address: '',
    gender: 1,
    enable: 1,
  }
  editDialogBool.value = true;
}
const update = (row: any) => {
  editInitVal.value = row
  editDialogBool.value = true;
}
const tableRef = ref<{select: () => void} | null>(null)
const callbackSelect = (_response?: RspType<any>, _submitData?: any) => {
  tableRef.value?.select()
}
</script>

<style lang="scss" scoped></style>