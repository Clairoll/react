const KoaRouter = require("koa-router");
const Models = require("../models");
const moment = require("moment");
const multer = require("koa-multer");
const MD5 = require("md5");

const router = new KoaRouter();

function randomString(len) {
  len = len || 32;
  let $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let maxPos = $chars.length;
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
// 每次登陆存储用户信息
let loginData = {};
// 登陆接口
router.post("/login", async ctx => {
  let { username, password, loginUser, taken } = ctx.request.body;

  let user = await Models.user.findAll({
    where: { username, password }
  });
  if (user.length === 0) {
    ctx.body = {
      code: 300,
      messages: "登陆失败"
    };
    return;
  }
  let Taken = MD5(randomString());
  let disableds = MD5(user[0].disabled ? user[0].disabled : randomString());
  loginData[loginUser] = {
    taken: taken || Taken,
    disabled: disableds
  };
  ctx.body = {
    code: 200,
    Taken,
    user: {
      username: user[0].username,
      disabled: disableds
    },
    messages: "登陆成功"
  };
});

// 首页接口
router.get("/home", async ctx => {
  let article = await Models.article.findAll();
  let comment = await Models.comment.findAll();
  let criticism = await Models.criticism.findAll();
  let user = await Models.user.findAll();
  let friend = await Models.friend.findAll();
  ctx.body = {
    articleList: article.length,
    commentList: comment.length,
    criticismList: criticism.length,
    userList: user.length,
    friendList: friend.length
  };
});

// 所有文章接口(删除文章接口)
router.post("/article", async ctx => {
  let { id, disabled, taken, loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (id) {
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    await Models.article.destroy({ where: { id: id } });
    await Models.comment.destroy({
      where: { articleId: id }
    });
  }
  //获取所有文章
  let article = await Models.article.findAll();
  for (let item of article) {
    let user = await Models.user.findById(item.userId);
    let category = await Models.category.findById(item.categoryId);
    item.setDataValue("username", user.get("username"));
    item.setDataValue("category", category.get("name"));
  }

  ctx.body = {
    code: 200,
    article
  };
});

// 编辑文章接口
router.post("/article/edit", async ctx => {
  let {
    id,
    disabled,
    taken,
    title,
    userId,
    categoryId,
    img,
    content,
    loginUser
  } = ctx.request.body;
  if (title) {
    let Taken = loginData[loginUser].taken
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    await Models.article.update(
      {
        title,
        userId,
        categoryId,
        img,
        content
      },
      {
        where: {
          id
        }
      }
    );
    let article = await Models.article.findAll();
    for (let item of article) {
      let user = await Models.user.findById(item.userId);
      let category = await Models.category.findById(item.categoryId);
      item.setDataValue("username", user.get("username"));
      item.setDataValue("category", category.get("name"));
    }
    ctx.body = {
      code: 200,
      article
    };

    return;
  }
  let article = await Models.article.findById(id);
  let user = await Models.user.findById(article.userId);
  let category = await Models.category.findById(article.categoryId);
  article.setDataValue("username", user.get("username"));
  article.setDataValue("category", category.get("name"));
  ctx.body = {
    article,
    code: 200
  };
});

// 写文章接口
router.post("/writeArticle", async ctx => {
  let {
    title,
    userId,
    categoryId,
    img,
    taken,
    content,
    disabled,
    loginUser
  } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (disabled !== MD5(true) || taken !== Taken) {
    ctx.body = {
      code: 203,
      messages: "抱歉权限不足，请联系管理员"
    };
    return;
  }
  let article = await Models.article.create({
    title,
    userId,
    categoryId,
    img,
    content
  });
  if (article.length == 0) {
    ctx.body = {
      code: 201,
      messages: "添加失败"
    };
    return;
  }
  ctx.body = {
    code: 200,
    messages: "保存成功"
  };
});

// 评论接口(删除评论接口)
router.post("/comment", async ctx => {
  let { id, disabled, taken,loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (id) {
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    // 若存在即表示删除，
    await Models.comment.destroy({ where: { id } });
  }
  let comment = await Models.comment.findAll();
  let article = null;
  let articletitle = [];
  for (let i of comment) {
    article = await Models.article.findById(i.articleId);
    articletitle.push(article.title);
  }
  ctx.body = {
    code: 200,
    articletitle,
    comment
  };
});

// 留言接口(删除留言接口)
router.post("/criticism", async ctx => {
  let { id, disabled, taken, loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (id) {
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    // 若存在即表示删除，
    await Models.criticism.destroy({ where: { id } });
  }
  let criticism = await Models.criticism.findAll();
  ctx.body = {
    code: 200,
    criticism
  };
});

// 时光轴接口(删除时光轴接口)
router.post("/time", async ctx => {
  let { id, disabled, taken, loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (id) {
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    // 若存在即表示删除，
    await Models.time.destroy({ where: { id } });
  }
  let time = await Models.time.findAll({
    order: [["createdAt", "DESC"]]
  });
  ctx.body = {
    code: 200,
    time
  };
});

// 编辑时光轴接口
router.post("/time/edit", async ctx => {
  let { id, disabled, taken,loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (id) {
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    await Models.time.update(
      {
        content: ctx.request.body.content,
        title: ctx.request.body.title
      },
      {
        where: {
          id
        }
      }
    );
  }

  let time = await Models.time.findOne({ where: { id } });
  let time0 = await Models.time.findAll({});
  ctx.body = {
    code: 200,
    time0,
    time
  };
});

// 添加时光轴接口
router.post("/time/add", async ctx => {
  let { disabled, taken,loginUser, title, content } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (disabled !== MD5(true) || taken !== Taken) {
    ctx.body = {
      code: 203,
      messages: "抱歉权限不足，请联系管理员"
    };
    return;
  }
  let time = await Models.time.create({
    title,
    content
  });
  let time0 = await Models.time.findAll({
    order: [["createdAt", "DESC"]]
  });
  ctx.body = {
    code: 200,
    time,
    time0
  };
});

// 分类接口(删除分类接口)
router.post("/category", async ctx => {
  let { id, disabled, taken, loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (id) {
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    await Models.category.destroy({ where: { id } });
  }
  let category = await Models.category.findAll();
  ctx.body = {
    category,
    code: 200
  };
});

// 编辑分类接口()
router.post("/category/edit", async ctx => {
  let { name, pid, id, disabled, taken,loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (name) {
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    await Models.category.update(
      {
        pid,
        name
      },
      {
        where: {
          id
        }
      }
    );
  }
  let category = await Models.category.findOne({
    where: { id }
  });
  let category0 = await Models.category.findAll();

  ctx.body = {
    code: 200,
    category0,
    category
  };
});

// 添加分类接口
router.post("/category/add", async ctx => {
  let { name, pid, disabled, taken,loginUser } = ctx.request.body;
  let hasone = await Models.category.findAll({
    where: {
      name
    }
  });
  let Taken = loginData[loginUser].taken
  if (disabled !== MD5(true) || taken !== Taken) {
    ctx.body = {
      code: 203,
      messages: "抱歉权限不足，请联系管理员"
    };
    return;
  }
  if (hasone.length !== 0) {
    ctx.body = {
      code: 205,
      messages: "该分类已存在"
    };
    return;
  }

  let category = await Models.category.create({
    name,
    pid
  });

  if (category.length === 0) {
    ctx.body = {
      code: 204,
      messages: "创建失败"
    };
    return;
  }

  let category0 = await Models.category.findAll({});
  ctx.body = {
    code: 200,
    category,
    category0
  };
});

// 用户接口(删除用户接口)
router.post("/user", async ctx => {
  let { id, disabled, taken,loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (id) {
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    await Models.user.destroy({
      where: { id: ctx.request.body.id }
    });
  }
  let user = await Models.user.findAll({
    attributes: {
      exclude: ["password"]
    }
  });
  ctx.body = {
    code: 200,
    user
  };
});

// 编辑用户接口
router.post("/user/edit", async ctx => {
  let { id, username, mobile, email, disabled, taken,loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (mobile) {
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    await Models.user.update(
      {
        username,
        mobile,
        email
      },
      {
        where: {
          id
        }
      }
    );
  }
  let user = await Models.user.findAll({
    where: { id },
    attributes: {
      exclude: ["password"]
    }
  });
  let user0 = await Models.user.findAll({
    attributes: {
      exclude: ["password"]
    }
  });

  ctx.body = {
    code: 200,
    user,
    user0
  };
});

// 修改用户权限接口
router.post("/user/permissions", async ctx => {
  let { disableds, disabled, taken, id,loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (disabled !== MD5(true) || taken !== Taken) {
    ctx.body = {
      code: 203,
      messages: "抱歉权限不足，请联系管理员"
    };
    return;
  }
  let user = await Models.user.update(
    {
      disabled: disableds
    },
    {
      where: {
        id
      }
    }
  );

  let user0 = await Models.user.findAll({
    attributes: {
      exclude: ["password"]
    }
  });

  ctx.body = {
    code: 200,
    user,
    user0
  };
});

// 添加用户接口
router.post("/user/add", async ctx => {
  let {
    mobile,
    username,
    password,
    email,
    avator,
    disabled,
    taken,
    loginUser
  } = ctx.request.body;
  let Taken = loginData[loginUser].taken

  if (disabled !== MD5(true) || taken !== Taken) {
    ctx.body = {
      code: 203,
      messages: "抱歉权限不足，请联系管理员"
    };
    return;
  }
  let hasmobile = await Models.user.findOne({
    where: {
      mobile
    }
  });
  if (hasmobile !== null) {
    ctx.body = {
      code: 201,
      messages: "当前手机号已存在"
    };
    return;
  }

  let hasemail = await Models.user.findOne({
    where: {
      mobile
    }
  });

  if (hasemail !== null) {
    ctx.body = {
      code: 201,
      messages: "当前邮箱已存在"
    };
    return;
  }

  await Models.user.create({
    username,
    password,
    mobile,
    email,
    avator
  });
  let user = await Models.user.findAll({
    attributes: {
      exclude: ["password"]
    }
  });
  ctx.body = {
    code: 200,
    user
  };
});

// 友情链接接口(删除友情链接接口)
router.post("/friend", async ctx => {
  let { id, taken, disabled, loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (id) {
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    await Models.friend.destroy({
      where: { id }
    });
  }
  let friend = await Models.friend.findAll();
  ctx.body = {
    code: 200,
    friend
  };
});

// 编辑友情链接接口
router.post("/friend/edit", async ctx => {
  let { id, title, url, content, taken, disabled, loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (title) {
    if (disabled !== MD5(true) || taken !== Taken) {
      ctx.body = {
        code: 203,
        messages: "抱歉权限不足，请联系管理员"
      };
      return;
    }
    await Models.friend.update(
      {
        title,
        url,
        content
      },
      {
        where: {
          id
        }
      }
    );
  }
  let friend = await Models.friend.findOne({
    where: { id }
  });
  let friend0 = await Models.friend.findAll({});
  ctx.body = {
    code: 200,
    friend,
    friend0
  };
});

// 添加友情链接接口
router.post("/friend/add", async ctx => {
  let { title, url, content, img, taken, disabled,loginUser } = ctx.request.body;
  let Taken = loginData[loginUser].taken
  if (disabled !== MD5(true) || taken !== Taken) {
    ctx.body = {
      code: 203,
      messages: "抱歉权限不足，请联系管理员"
    };
    return;
  }
  let friend = await Models.friend.create({
    title,
    url,
    content,
    img,
    createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: moment().format("YYYY-MM-DD HH:mm:ss")
  });
  let friend0 = await Models.friend.findAll({});
  ctx.body = {
    code: 200,
    friend,
    friend0
  };
});

//图片上传路径
var storage = multer.diskStorage({
  //文件保存路径
  destination: function(req, file, cb) {
    cb(null, "./public/upload/article");
  },
  //修改文件名称
  filename: function(req, file, cb) {
    var fileFormat = file.originalname.split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
//加载配置
var upload = multer({ storage: storage });

router.post("/imgUpload", upload.single("file"), async (ctx, next) => {
  ctx.body = {
    filename: ctx.req.file.filename, //返回文件名
    imageUrl: "http://127.0.0.1:8888/" + ctx.req.file.path
  };
});

module.exports = router;
