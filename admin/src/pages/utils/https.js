import axios from "axios";
import tool from "./tool";
import { browserHistory } from "react-router";
import { message } from "antd";
//取消请求
axios.create({
  timeout: 15000, // 请求超时时间
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

//开始请求设置，发起拦截处理
axios.interceptors.request.use(
  config => {
    config.data = config.data || {};
    config.data.taken = tool.getCookie("taken");
    config.data.loginUser = tool.getItem("user");
    config.data.disabled = tool.getItem("disabled");
    if (config.url === "/admin/login" || tool.getItem("user")) {
      return config;
    } else {
      message.error("请先登陆");
      browserHistory.push("/");
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  }
);
// respone拦截器
axios.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;
