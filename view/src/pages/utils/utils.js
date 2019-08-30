export default {
  // 格式化时间
  formatDate(time, fmt = "yyyy-MM-dd hh:mm:ss") {
    var date = new Date(time);
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    let o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
        );
      }
    }
    return fmt;
  },
  // 将数据存入
  setItem(name, data) {
    sessionStorage.setItem(name, JSON.stringify(data));
  },
  //读取数据
  getItem(name) {
    return JSON.parse(sessionStorage.getItem(name));
  },
  // 清除数据
  removeItem(name) {
    sessionStorage.removeItem(name);
  },
  // 获取cookie
  getCookie(key) {
    const name = key + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },

  // 设置cookie,默认是3天
  setCookie(key, value) {
    const d = new Date();
    d.setTime(d.getTime() + 3 * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toGMTString();
    document.cookie = key + "=" + value + "; " + expires;
  },
  //删除cookie
  removeCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null)
      document.cookie =
        name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
  }
};
