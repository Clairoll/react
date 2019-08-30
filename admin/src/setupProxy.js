const proxy = require("http-proxy-middleware");
 
module.exports = function(app) {
  app.use(proxy('/admin', { 
    target: "http://127.0.0.1:8888",
    secure: false,
    changeOrigin: true,
    pathRewrite: {
     "^/admin": "/"
    },
 }));
};