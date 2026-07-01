import { nextTick } from "vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const useNProgress = () => {
  NProgress.configure({ showSpinner: false });

  const initColor = async () => {
    await nextTick();
    const bar = document
      .getElementById("nprogress")
      ?.getElementsByClassName("bar")[0] as HTMLElement;

    if (bar) {
      // 原生获取 CSS 变量（--el-color-primary）
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary');
      bar.style.background = primaryColor;
    }
  };

  initColor();

  const start = () => {
    NProgress.start();
  };

  const done = () => {
    NProgress.done();
  };

  return {
    start,
    done,
  };
};

export default useNProgress;