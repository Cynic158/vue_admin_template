<template>
  <div class="page-container">
    <EditDialog
      ref="editDialogRef"
      :dialog-params="{
        title: '角色',
        type: 'default',
        show: editDialogBool,
        hide: hideEditDialog,
      }"
      :init-val="editInitVal",
      :form-config="{
        key: 'id',
        formMap: editFormMap,
        insertApi: roleManageApi.insert,
        updateApi: roleManageApi.update,
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
        selectApi: roleManageApi.select,
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
        <div class="menu-tree">
          <el-tree
            ref="treeRef"
            :data="menuTree"
            default-expand-all
            show-checkbox
            node-key="id"
          ></el-tree>
        </div>
        <el-button v-if="showConfirm" type="primary" @click="setRoleTree">确定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import MixTable from '../../../../components/MixTable.vue';
import EditDialog from '../../../../components/EditDialog.vue';
import type { SelectConfigType, SelectExtraBtnsType, TableRowsType } from '../../../../components/mixTable';
import type { FormItemType, EditDialogInstance } from '../../../../components/editDialog';
import { onMounted, ref } from 'vue';
import roleManageApi from '../../../../api/permission_manage/role_manage';
import menuConfigApi from '../../../../api/permission_manage/menu_config';
import { cloneDeep } from 'lodash';
import { ElMessage, type TreeInstance } from 'element-plus';

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
  flatMenus: [] as Array<{label: string;value: number}>,
});
const menuTree = ref<Array<RoleMenuTreeType>>([])
const loading = ref(false)
/**
 * 递归构建菜单树
 */
function buildTree(
  list: MenuType[],
  parentId: number
): RoleMenuTreeType[] {
  // 找到当前 parentId 的所有子节点
  const nodes = list.filter(item => item.parentId === parentId);

  return nodes.map(item => ({
    label: item.name,
    id: item.id,
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

      selectOptions.value.flatMenus = cloneDeep(enableList.map((item) => {
        return {
          label: item.name,
          value: item.id,
        }
      }))

      // 2. 排序：全部按 sort 从小到大
      enableList.sort((a, b) => a.sort - b.sort);

      // 3. 构建菜单树
      const tree = buildTree(enableList, 0);

      // 4. 赋值
      menuTree.value = tree;
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
const treeRef = ref<TreeInstance>()
const showConfirm = ref(false)
const showMenuDrawer = (confirm: boolean) => {
  showConfirm.value = confirm
  if (!confirm) {
    setTree([])
  }
  menuDrawer.value = true
}
const setTree = (val: Array<number>) => {
  if (treeRef.value) {
    if (val.length) {
      treeRef.value!.setCheckedKeys([])
      val.forEach((item) => {
        treeRef.value!.setChecked(item, true, false)
      })
    } else {
      treeRef.value!.setCheckedKeys(val)
    }
  }
}
const getTree = () => {
  if (treeRef.value) {
    let halfKeys = treeRef.value.getHalfCheckedKeys() as Array<number>;
    let checkedKeys = treeRef.value.getCheckedKeys() as Array<number>;
    return [...checkedKeys, ...halfKeys];
  } else {
    return [];
  }
}
const setRoleTree = () => {
  let newTree = getTree()
  editDialogRef.value?.updateFormVal('menu', newTree)
  menuDrawer.value = false
  ElMessage({
    type: 'success',
    message: '设置成功',
  })
}

const extraBtns: Array<SelectExtraBtnsType> = [
  {
    type: 'primary',
    title: '查看菜单树',
    action: () => {
      showMenuDrawer(false)
    },
  }
]

const selectConfig: Array<SelectConfigType> = [
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
    label: '角色名称',
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
    name: '角色名称',
    key: 'name',
    width: '180',
  },
  {
    name: '角色描述',
    key: 'desc',
    width: '180',
    overflow: true,
  },
  {
    name: '角色菜单',
    key: 'menu',
    width: '240',
    overflow: true,
    format: (row: any, _index: number) => {
      return (row.menu as Array<number>).map((item) => selectOptions.value.flatMenus.find((menuItem) => menuItem.value == item)?.label || '').join(',');
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
    type: 'option',
    name: '操作',
    key: '',
    width: '150',
  },
];

const editInitVal = ref({
  enable: 1,
  menu: [],
  name: '',
  desc: '',
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
    label: '角色名称',
    type: 'string',
    required: true,
  },
  {
    key: 'desc',
    label: '角色描述',
    type: 'textarea',
    required: true,
  },
  {
    key: 'menu',
    label: '角色权限',
    type: 'button',
    required: true,
    buttonConfig: {
      title: '编辑权限菜单',
      type: 'primary',
      action: (formdata?: any) => {
        let menu: Array<number> = formdata!.menu
        showMenuDrawer(true)
        setTimeout(() => {
          setTree(menu)
        }, 300);
      }
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

const editDialogRef = ref<EditDialogInstance>()
const editDialogBool = ref(false);
const hideEditDialog = () => {
  editDialogBool.value = false;
}
const insert = () => {
  editInitVal.value = {
    enable: 1,
    menu: [],
    name: '',
    desc: '',
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

<style lang="scss" scoped>
.menu-tree-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .menu-tree {
    width: 100%;
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>