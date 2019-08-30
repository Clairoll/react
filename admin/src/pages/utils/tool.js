export default {
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
  },
  // 随机字符串用作taken
  randomString(len) {
    len = len || 32;
    let $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    let maxPos = $chars.length;
    let pwd = "";
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
// 将数据处理为树形数据
  tree(id,array){
    let data = array.filter(item => item.pid === id);
    data.forEach(item => {
      item.children = this.tree(item.id,array);
    });
    return data;  
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
};
