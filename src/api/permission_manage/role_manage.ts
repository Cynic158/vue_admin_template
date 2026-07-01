// 角色api
import requestApi from "../../utils/request";

const roleManageApi = {
  // 查询角色
  select: (params: object) =>
    requestApi.post<TableRspType<any>>(
      "/permission/role/select",
      params,
      "select",
    ),
  // 新增角色
  insert: (params: object) =>
    requestApi.post<null>("/permission/role/insert", params, "insert"),
  // 更新角色
  update: (params: object) =>
    requestApi.post<null>("/permission/role/update", params, "update"),
};

export default roleManageApi;
