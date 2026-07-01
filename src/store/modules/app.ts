// 通用模块
import { defineStore } from "pinia";
import { ref } from "vue";

// 创建仓库
const useAppStore = defineStore("app", () => {
  // 常规配置
  const appConfig = ref({
    name: 'VueAdminTemplate',
    version: 'v1.0.0',
  })

  // 菜单折叠
  const menuCollapse = ref(false)
  const switchMenuCollapse = () => {
    menuCollapse.value = !menuCollapse.value
  }

  // 通用表格加载
  const tableSelectLoading = ref(false)
  const tableInsertLoading = ref(false)
  const tableUpdateLoading = ref(false)
  const tableDeleteLoading = ref(false)

  // 图像资源url
  const resourceUrl = ref('http://127.0.0.1/static')

  return {
    appConfig,
    menuCollapse,
    switchMenuCollapse,
    tableSelectLoading,
    tableInsertLoading,
    tableUpdateLoading,
    tableDeleteLoading,
    resourceUrl,
  }
})

export default useAppStore