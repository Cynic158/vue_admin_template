// 管理api
import requestApi from "../../utils/request";

const managerListApi = {
  // 查询管理
  select: (params: object) =>
    requestApi.post<TableRspType<any>>(
      "/permission/manager/select",
      params,
      "select",
    ),
  // 新增管理
  insert: (params: object) =>
    requestApi.post<null>("/permission/manager/insert", params, "insert", { checkParams: false }),
  // 更新管理
  update: (params: object) =>
    requestApi.post<null>("/permission/manager/update", params, "update", { checkParams: false }),
};

export default managerListApi;