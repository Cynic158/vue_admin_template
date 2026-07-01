<template>
  <div class="page-container">
    <EditDialog
      :dialog-params="{
        title: '菜单',
        type: 'default',
        show: editDialogBool,
        hide: hideEditDialog,
      }"
      :init-val="editInitVal",
      :form-config="{
        key: 'id',
        formMap: editFormMap,
        insertApi: menuConfigApi.insert,
        updateApi: menuConfigApi.update,
        callback: callbackSelect,
      }"
      :select-options="selectOptions"
    ></EditDialog>
    <MixTable
      ref="tableRef"
      :select-config="selectConfig"
      :select-options="selectOptions"
      :select-extra-btns="extraBtns"
      :table-options="{
        selectApi: menuConfigApi.select,
        showInsert: insert,
        showUpdate: update,
        rowsConfig: tableRowsConfig,
      }"
    ></MixTable>

    <el-drawer
      v-model="menuDrawer"
      append-to-body
      :size="350"
      title="菜单树"
    >
      <div class="menu-tree-container">
        <el-tree
          :data="menuTree"
          default-expand-all
        ></el-tree>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import MixTable from '../../../../components/MixTable.vue';
import EditDialog from '../../../../components/EditDialog.vue';
import type { SelectConfigType, SelectExtraBtnsType, TableRowsType } from '../../../../components/mixTable';
import type { FormItemType } from '../../../../components/editDialog';
import { onMounted, ref } from 'vue';
import menuConfigApi from '../../../../api/permission_manage/menu_config';

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
  parentMenus: [] as Array<{label: string;value: number}>,
});
const menuTree = ref<Array<MenuTreeType>>([])
const loading = ref(false)
/**
 * 递归构建菜单树
 */
function buildTree(
  list: MenuType[],
  parentId: number
): MenuTreeType[] {
  // 找到当前 parentId 的所有子节点
  const nodes = list.filter(item => item.parentId === parentId);

  return nodes.map(item => ({
    label: item.name,
    // 递归找子节点
    children: buildTree(list, item.id),
  }));
}
const getMenuTree = async () => {
  try {
    loading.value = true;
    const res: RspType<Array<MenuType>> = await menuConfigApi.selectAll();
    if (res.success) {
      const list = res.data;

      // 1. 过滤：只保留 enable = 1
      const enableList = list.filter(item => item.enable === 1);

      // 2. 排序：全部按 sort 从小到大
      enableList.sort((a, b) => a.sort - b.sort);

      // 3. 构建菜单树
      const tree = buildTree(enableList, 0);

      // 4. 赋值
      menuTree.value = tree;

      // 5. 顶级菜单赋值
      selectOptions.value.parentMenus = enableList
        .filter(item => item.parentId === 0)
        .map(item => ({
          label: item.name,
          value: item.id,
        }));
      selectOptions.value.parentMenus.unshift({
        label: '无上级',
        value: 0,
      })
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  getMenuTree()
})

// 菜单树抽屉
const menuDrawer = ref(false);
const showMenuDrawer = () => {
  menuDrawer.value = true
}
const extraBtns: Array<SelectExtraBtnsType> = [
  {
    type: 'primary',
    title: '查看菜单树',
    action: showMenuDrawer,
  }
]

const selectConfig: Array<SelectConfigType> = [
  {
    key: 'parentId',
    label: '上级菜单',
    type: 'select',
    selectConfig: {
      optionsKey: 'parentMenus',
    },
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
    key: 'name',
    label: '菜单名称',
    type: 'string',
  },
  {
    key: 'path',
    label: '菜单路由',
    type: 'string',
  },
];
const tableRowsConfig: Array<TableRowsType> = [
  {
    name: 'ID',
    key: 'id',
    width: '120',
  },
  {
    name: '菜单名称',
    key: 'name',
    width: '180',
  },
  {
    name: '菜单路由',
    key: 'path',
    width: '180',
  },
  {
    name: '上级菜单',
    key: 'parentId',
    width: '180',
    format: (row: any, _index: number) => {
      return selectOptions.value.parentMenus.find((item) => item.value == row.parentId)?.label || row.parentId;
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
    name: '排序',
    key: 'sort',
    width: '120',
  },
  {
    type: 'option',
    name: '操作',
    key: '',
    width: '150',
  },
];

const editInitVal = ref({
  parentId: null,
  enable: 1,
  sort: null,
  name: '',
  path: '',
});
const editFormMap: Array<FormItemType> = [
  {
    key: 'Id',
    label: '',
    type: 'number',
    required: true,
    placeholder: '',
    hidden: true,
  },
  {
    key: 'name',
    label: '菜单名称',
    type: 'string',
    required: true,
  },
  {
    key: 'path',
    label: '菜单路由',
    type: 'string',
    required: true,
  },
  {
    key: 'parentId',
    label: '上级菜单',
    type: 'select',
    required: true,
    selectConfig: {
      optionsKey: 'parentMenus',
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
  {
    key: 'sort',
    label: '排序',
    type: 'number',
    required: true,
    numberConfig: {
      min: 0,
      precision: 0,
    },
  },
];

const editDialogBool = ref(false);
const hideEditDialog = () => {
  editDialogBool.value = false;
}
const insert = () => {
  editInitVal.value = {
    parentId: null,
    enable: 1,
    sort: null,
    name: '',
    path: '',
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
  getMenuTree()
}
</script>

<style lang="scss" scoped>
.menu-tree-container {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>