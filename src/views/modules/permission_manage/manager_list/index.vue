<template>
  <div class="page-container">
    <EditDialog
      :dialog-params="{
        title: '管理',
        type: 'default',
        show: editDialogBool,
        hide: hideEditDialog,
      }"
      :init-val="editInitVal",
      :form-config="{
        key: 'id',
        formMap: editFormMap,
        insertApi: managerListApi.insert,
        updateApi: managerListApi.update,
        submitFormater,
        submitValidator,
        callback: callbackSelect,
      }"
      :select-options="selectOptions"
    ></EditDialog>
    <MixTable
      ref="tableRef"
      :select-config="selectConfig"
      :select-options="selectOptions"
      :table-options="{
        selectApi: managerListApi.select,
        showInsert: insert,
        showUpdate: userStore.userInfo.manager ? update : undefined,
        rowsConfig: tableRowsConfig,
      }"
    ></MixTable>
  </div>
</template>

<script setup lang="ts">
import MixTable from '../../../../components/MixTable.vue';
import EditDialog from '../../../../components/EditDialog.vue';
import type { SelectConfigType, TableRowsType } from '../../../../components/mixTable';
import type { FormItemType, FormType } from '../../../../components/editDialog';
import { onMounted, ref } from 'vue';
import managerListApi from '../../../../api/permission_manage/manager_list';
import roleManageApi from '../../../../api/permission_manage/role_manage';
import sha256 from 'sha256';
import useUserStore from '../../../../store/modules/user';

const userStore = useUserStore()

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
  manager: [
    {
      label: '是',
      value: 1,
    },
    {
      label: '否',
      value: 0,
    },
  ],
  roles: [] as Array<{label: string;value: number}>,
});

const getRoles = async () => {
  try {
    let res: RspType<TableRspType<{id: number, name: string}>> = await roleManageApi.select({page: 1, pageSize: 1000, enable: 1})
    if (res.success) {
      selectOptions.value.roles = res.data.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        }
      })
    }
  } catch (error) {
    console.log(error);
  }
}
onMounted(() => {
  getRoles()
})

const selectConfig: Array<SelectConfigType> = [
  {
    key: 'email',
    label: '邮箱',
    type: 'string',
  },
  {
    key: 'userName',
    label: '用户名',
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
  {
    key: 'manager',
    label: '是否管理',
    type: 'select',
    selectConfig: {
      optionsKey: 'manager',
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
    name: '用户名',
    key: 'userName',
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
    name: '是否管理',
    key: 'manager',
    width: '120',
    format: (row: any, _index: number) => {
      return selectOptions.value.manager.find((item) => item.value == row.manager)?.label || row.manager;
    },
  },
  {
    name: '是否启用',
    key: 'enable',
    width: '120',
    format: (row: any, _index: number) => {
      return selectOptions.value.enable.find((item) => item.value == row.enable)?.label || row.enable;
    },
  },
  {
    name: '角色',
    key: 'role',
    width: '200',
    overflow: true,
    format: (row: any, _index: number) => {
      return (row.role as Array<number>).map((item) => selectOptions.value.roles.find((roleItem) => roleItem.value == item)?.label || '').join(',');
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
    type: 'time',
    name: '登录时间',
    key: 'loginAt',
    width: '180',
  },
  {
    type: 'option',
    name: '操作',
    key: '',
    width: '150',
  },
];

const editInitVal = ref({
  email: '',
  password: '',
  userName: '',
  manager: 0,
  enable: 1,
  role: [],
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
    key: 'userName',
    label: '用户名',
    type: 'string',
    required: true,
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'string',
    required: true,
  },
  {
    key: 'password',
    label: '密码',
    type: 'string',
    required: false,
    placeholder: '空密码意为不更新密码(非新增)'
  },
  {
    key: 'role',
    label: '角色',
    type: 'select',
    required: false,
    selectConfig: {
      optionsKey: 'roles',
      multiple: true,
    }
  },
  {
    key: 'manager',
    label: '是否管理',
    type: 'boolean',
    required: true,
    booleanConfig: {
      falseLabel: '否',
      trueLabel: '是',
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
];
const submitFormater = (formData: FormType) => {
  if (formData.password) {
    formData.password = sha256(formData.password)
  } else {
    formData.password = ''
  }
  
  return formData
}
const submitValidator = (formData: FormType): [boolean, string] => {
  if (!formData.id) {
    // 新增时必须填写密码
    if (!formData.password) {
      return [false, '新增时密码不能为空']
    } else {
      return [true, '']
    }
  } else {
    return [true, '']
  }
}

const editDialogBool = ref(false);
const hideEditDialog = () => {
  editDialogBool.value = false;
}
const insert = () => {
  editInitVal.value = {
    email: '',
    password: '',
    userName: '',
    manager: 0,
    enable: 1,
    role: [],
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