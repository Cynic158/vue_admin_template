import { createApp } from "vue";
import "element-plus/dist/index.css";
// 全局样式
import "./styles/index.scss";
import App from "./App.vue";
// 注册仓库
import store from "./store";
// 注册路由
import router from "./router";
// svg配置
import "virtual:svg-icons-register";

const app = createApp(App);
app.use(store);
app.use(router);
app.mount("#app");
