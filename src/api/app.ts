// 通用api
import requestApi from "../utils/request";

const appApi = {
  // 上传图像
  uploadImage: (formData: FormData) => requestApi.post<string>("/app/upload/image", formData),
  // 上传文件
  uploadFile: (formData: FormData) => requestApi.post<string>("/app/upload/file", formData),
}

export default appApi