// 菜单api
import requestApi from "../../utils/request";

const menuConfigApi = {
  // 查询菜单树
  select: (params: object) =>
    requestApi.post<TableRspType<any>>(
      "/permission/menu/select",
      params,
      "select",
    ),
  // 查询整个菜单树
  selectAll: () =>
    requestApi.get<Array<any>>("/permission/menu/selectall", {}, "other", {
      showSuccessMsg: false,
    }),
  // 新增菜单
  insert: (params: object) =>
    requestApi.post<null>("/permission/menu/insert", params, "insert"),
  // 更新菜单
  update: (params: object) =>
    requestApi.post<null>("/permission/menu/update", params, "update"),
};

export default menuConfigApi;
