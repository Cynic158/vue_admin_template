<template>
  <div class="mix-table-container">
    <el-card shadow="always" class="mix-table-header">
      <el-form
        label-width="auto"
        :inline="true"
        label-position="left"
        :disabled="appStore.tableSelectLoading"
      >
        <el-row :gutter="16">
          <el-col :span="8" v-for="item in props.selectConfig" :key="item.key">
            <el-form-item :label="item.label + '：'">
              <el-input-number
                style="width: 100%;"
                v-if="item.type == 'number'"
                v-model="selectParams[item.key]"
                :min="item.numberConfig?.min"
                :max="item.numberConfig?.max"
                :precision="item.numberConfig?.precision"
                :placeholder="'请输入' + item.label"
                :controls="false"
                align="left"
                :disabled-scientific="true"
              ></el-input-number>
              <el-input
                v-else-if="item.type == 'string'"
                v-model="selectParams[item.key]"
                :placeholder="'请输入' + item.label"
                clearable
              ></el-input>
              <el-select
                v-else-if="item.type == 'select'"
                v-model="selectParams[item.key]"
                :placeholder="'请选择' + item.label"
                :options="props.selectOptions![item.selectConfig!.optionsKey]"
                :multiple="item.selectConfig?.multiple"
                :multiple-limit="item.selectConfig?.multipleLimit"
                :collapse-tags="item.selectConfig?.collapseTags"
                :max-collapse-tags="item.selectConfig?.maxCollapseTags"
                clearable
                fit-input-width
              ></el-select>
              <el-select
                v-else-if="item.type == 'enable'"
                v-model="selectParams[item.key]"
                :placeholder="'请选择' + item.label"
                :options="[{label: '启用',value: true},{label: '禁用',value: false}]"
                clearable
                fit-input-width
              ></el-select>
              <el-select
                v-else-if="item.type == 'yesno'"
                v-model="selectParams[item.key]"
                :placeholder="'请选择' + item.label"
                :options="[{label: '是',value: true},{label: '否',value: false}]"
                clearable
                fit-input-width
              ></el-select>
              <el-date-picker
                v-else-if="item.type == 'range'"
                v-model="selectParams[item.key]"
                type="datetimerange"
                :unlink-panels="true"
                :value-format="item.timeConfig?.timeFormat"
                :format="item.timeConfig?.timeFormat"
                :shortcuts="shortcuts"
              ></el-date-picker>
              <el-date-picker
                v-else-if="item.type == 'time'"
                style="width: 100%;"
                v-model="selectParams[item.key]"
                :type="item.timeConfig?.dateType"
                :value-format="item.timeConfig?.timeFormat"
                :format="item.timeConfig?.timeFormat"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="mix-table-header-btn" :span="24">
            <el-button type="primary" @click="select">查询</el-button>
            <el-button type="warning" @click="resetParams">重置</el-button>
            <el-button v-if="props.tableOptions.showInsert" type="success" @click="props.tableOptions.showInsert">新增</el-button>
            <template v-if="props.selectExtraBtns">
              <el-button
                v-for="(item, index) in props.selectExtraBtns"
                :key="index"
                :type="item.type"
                @click="() => {item.action()}"
              >{{ item.title }}</el-button>
            </template>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="mix-table-main">
      <el-table
        v-loading="appStore.tableSelectLoading"
        :data="tableParams.data"
        highlight-current-row
        border
        stripe
      >
        <el-table-column
          align="center"
          width="80"
          label="序号"
          type="index"
          :index="(selectParams.page - 1) * selectParams.pageSize + 1"
          fixed="left"
        ></el-table-column>

        <template
          v-for="item in props.tableOptions.rowsConfig"
          :key="item.key"
        >
          <!-- 常规列 -->
          <el-table-column
            v-if="!item.type && !item.format"
            align="center"
            :min-width="item.width"
            :prop="item.key"
            :label="item.name"
            :show-overflow-tooltip="item.overflow"
            :sortable="item.sortable"
          ></el-table-column>
          <el-table-column
            v-if="!item.type && item.format"
            align="center"
            :min-width="item.width"
            :prop="item.key"
            :label="item.name"
            :show-overflow-tooltip="item.overflow"
            :sortable="item.sortable"
          >
            <template #default="{ row, $index }">
              {{ item.format(row, $index) }}
            </template>
          </el-table-column>

          <!-- 启用禁用 -->
          <el-table-column
            v-if="item.type == 'enable'"
            align="center"
            width="120"
            :prop="item.key"
            :label="item.name"
            :sortable="item.sortable"
          >
            <template #default="{ row }">
              <el-text v-if="row[item.key]" type="primary">启用</el-text>
              <el-text v-else type="danger">禁用</el-text>
            </template>
          </el-table-column>
          <!-- 是否 -->
          <el-table-column
            v-if="item.type == 'yesno'"
            align="center"
            width="120"
            :prop="item.key"
            :label="item.name"
            :sortable="item.sortable"
          >
            <template #default="{ row }">
              <el-text v-if="row[item.key]" type="primary">是</el-text>
              <el-text v-else type="danger">否</el-text>
            </template>
          </el-table-column>

          <!-- 时间 -->
          <el-table-column
            v-if="item.type == 'time'"
            align="center"
            :min-width="item.width"
            :prop="item.key"
            :label="item.name"
            :sortable="item.sortable"
          >
            <template #default="{ row }">
              {{ formatDate(row[item.key], (item.timeFormat ? item.timeFormat : 'YYYY-MM-DD HH:mm:ss')) }}
            </template>
          </el-table-column>

          <!-- 链接 -->
          <el-table-column
            v-if="item.type == 'link'"
            align="center"
            width="200"
            :prop="item.key"
            :label="item.name"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-link
                class="mix-table-link"
                :href="row[item.key]"
                target="_blank"
                type="primary"
              >{{ row[item.key] }}</el-link>
            </template>
          </el-table-column>

          <!-- JSON -->
          <el-table-column
            v-if="item.type == 'json'"
            align="center"
            width="180"
            :prop="item.key"
            :label="item.name"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ JSON.stringify(row[item.key]) }}
            </template>
          </el-table-column>

          <!-- 图片 -->
          <el-table-column
            v-if="item.type == 'image'"
            align="center"
            :min-width="item.width"
            :prop="item.key"
            :label="item.name"
          >
            <template #default="{ row }">
              <div class="image-row-item" :style="{ width: item.imageSize![0] + 'px', height: item.imageSize![1] + 'px' }">
                <el-image
                  style="width: 100%; height: 100%"
                  :src="item.url ? (item.url + row[item.key]) : (appStore.resourceUrl + row[item.key])"
                  fit="cover"
                  @click="zoomImage([row[item.key]], 0, item.url)"
                ></el-image>
              </div>
            </template>
          </el-table-column>

          <el-image-viewer
            :url-list="imageViewerParams.imageUrlList"
            show-progress
            :initial-index="imageViewerParams.previewIndex"
            v-if="imageViewerParams.showPreview"
            teleported
            @close="hidePreview"
          ></el-image-viewer>

          <!-- 隐藏字段 -->
          <el-table-column
            v-if="item.type == 'hide'"
            align="center"
            :min-width="item.width"
            :show-overflow-tooltip="item.overflow"
            :prop="item.key"
            :label="item.name"
          >
            <template #default="{ row, $index }">
              {{ tableParams.data[$index][item.hideKey!] ? '******' : row[item.key] }}
              <el-icon @click="() => {
                tableParams.data[$index][item.hideKey!] = false
              }" v-if="tableParams.data[$index][item.hideKey!]" size="16">
                <View />
              </el-icon>
              <el-icon @click="() => {
                tableParams.data[$index][item.hideKey!] = true
              }" v-if="!tableParams.data[$index][item.hideKey!]" size="16">
                <Hide />
              </el-icon>
            </template>
          </el-table-column>

          <!-- 插槽传入例如：<template #FinalMidPrice="{ row }"> -->
          <el-table-column
            v-if="item.type == 'slot'"
            align="center"
            :min-width="item.width"
            :prop="item.key"
            :label="item.name"
            :sortable="item.sortable"
            :show-overflow-tooltip="item.overflow"
          >
            <template #default="scope">
              <slot :name="item.key" v-bind="scope"></slot>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column
            v-if="item.type == 'option'"
            align="center"
            :min-width="item.width"
            label="操作"
            fixed="right"
          >
            <template #default="{ row }">
              <el-button
                v-if="props.tableOptions.showUpdate"
                size="small"
                type="primary"
                @click="props.tableOptions.showUpdate(row)"
              >更新</el-button>
              <el-button
                v-if="props.tableOptions.showDelete"
                size="small"
                type="danger"
                @click="props.tableOptions.showDelete(row)"
              >删除</el-button>
            </template>
          </el-table-column>

          <!-- 操作-插槽传入 -->
          <el-table-column
            v-if="item.type == 'option-slot'"
            align="center"
            :min-width="item.width"
            :label="item.name"
            fixed="right"
          >
            <template #default="scope">
              <slot :name="item.key" v-bind="scope"></slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="mix-table-footer">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="tableParams.total"
        v-model:current-page="selectParams.page"
        v-model:page-size="selectParams.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :disabled="(tableParams.total <= selectParams.pageSize) || appStore.tableSelectLoading"
        @size-change="sizeChange"
        @current-change="select"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import useAppStore from '../store/modules/app';
import { cloneDeep } from 'lodash';
import { formatDate, shortcuts } from '../utils';
import type { SelectConfigType, SelectExtraBtnsType, TableRowsType } from './mixTable';
import { Hide, View } from '@element-plus/icons-vue';

const props = defineProps<{
  selectConfig: Array<SelectConfigType>;
  selectOptions?: { [key: string]: Array<{ label: string; value: any }> };
  selectExtraBtns?: Array<SelectExtraBtnsType>;
  tableOptions: {
    selectApi: (params: any) => Promise<RspType<any>>;
    showInsert?: () => void;
    showUpdate?: (row: any) => void;
    showDelete?: (row: any) => void;
    rowsConfig: Array<TableRowsType>;
    hideRowsBool?: Array<string>;
  };
}>()

const appStore = useAppStore()

const selectParams = ref<{[key: string]: any}>({
  page: 1,
  pageSize: 30,
})
const lastSelectParams = ref<{[key: string]: any}>({
  page: 1,
  pageSize: 30,
})
const resetParams = () => {
  selectParams.value = {
    page: 1,
    pageSize: 30,
  }
  lastSelectParams.value = {
    page: 1,
    pageSize: 30,
  }
}
const tableParams = ref({
  data: [] as Array<any>,
  total: 0,
})
const select = async () => {
  try {
    let currentSelectParams: Partial<any> = cloneDeep(selectParams.value);
    delete currentSelectParams.page;
    delete currentSelectParams.pageSize;

    let lastParams: Partial<any> = cloneDeep(lastSelectParams.value);
    delete lastParams.page;
    delete lastParams.pageSize;

    if (JSON.stringify(currentSelectParams) !== JSON.stringify(lastParams)) {
        selectParams.value.page = 1
    }

    lastSelectParams.value = cloneDeep(selectParams.value)

    let res: RspType<TableRspType<any>> = await props.tableOptions.selectApi(selectParams.value)
    if (res.success) {
      if (props.tableOptions.hideRowsBool) {
        props.tableOptions.hideRowsBool.forEach((item) => {
          for (let index = 0; index < res.data.data.length; index++) {
            res.data.data[index][item] = true
          }
        })
      }
      tableParams.value.data = res.data.data;
      tableParams.value.total = res.data.total;
    }
  } catch (error) {
    console.log(error)
  }
}
defineExpose({
  select
});
const sizeChange = () => {
  selectParams.value.page = 1
  select()
}

const imageViewerParams = ref({
  imageUrlList: [] as Array<string>,
  previewIndex: 0,
  showPreview: false,
})
const hidePreview = () => {
  imageViewerParams.value.showPreview = false
}
const zoomImage = (list: Array<string>, index: number, url: string | undefined) => {
  let mapList: Array<string> = []
  if (url) {
    mapList = list.map((item) => (url + item))
  } else {
    mapList = list.map((item) => (appStore.resourceUrl + item))
  }
  imageViewerParams.value.imageUrlList = mapList
  imageViewerParams.value.previewIndex = index
  imageViewerParams.value.showPreview = true
}

onMounted(() => {
  select()
})
</script>

<style lang="scss" scoped>
.mix-table-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  .mix-table-header {
    width: 100%;
    margin-bottom: 16px;
    .el-form-item {
      width: 100%;
      margin-right: 0;
    }
    .mix-table-header-btn {
      display: flex;
      align-items: center;
      justify-content: right;
    }
  }
  .mix-table-main {
    width: 100%;
    flex: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column;
  }
  .mix-table-footer {
    width: 100%;
    padding-top: 16px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
.mix-table-link {
  justify-content: center;
  max-width: 100%;
  .el-link__inner {
    max-width: 100%;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    text-wrap: nowrap;
  }
}

.image-row-item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  width: 60px;
  height: 60px;
  border-radius: 4px;
  cursor: pointer;
  margin: auto;
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
</style>