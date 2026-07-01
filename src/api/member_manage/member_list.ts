// 会员api
import requestApi from "../../utils/request";

const memberListApi = {
  // 查询会员
  select: (params: object) =>
    requestApi.post<TableRspType<any>>(
      "/member_manage/member_list/select",
      params,
      "select",
    ),
  // 新增会员
  insert: (params: object) =>
    requestApi.post<null>("/member_manage/member_list/insert", params, "insert"),
  // 更新会员
  update: (params: object) =>
    requestApi.post<null>("/member_manage/member_list/update", params, "update"),
};

export default memberListApi;