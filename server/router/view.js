const KoaRouter = require("koa-router");
const Models = require("../models");
const MD5 = require("md5");
// const Sequelize = require("sequelize");
const moment = require("moment");
const multer = require("koa-multer");

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

let taken = "";
let md5Taken ="";

// 博文列表接口
router.post("/view/article", async ctx => {
  let article = await Models.article.findAll({
    order: [["createdAt", "DESC"]]
  });

  for (i = 0; i < article.length; i++) {
    let user = await Models.user.findById(article[i].userId);
    let category = await Models.category.findById(article[i].categoryId);
    let comments = await Models.comment.findAll({
      where: {
        articleId: article[i].id
      }
    });
    article[i].setDataValue("comment", comments);
    article[i].setDataValue("username", user.get("username"));
    article[i].setDataValue("category", category.get("name"));
  }

  ctx.body = {
    article
  };
});

// 热门文章接口
router.post("/view/hotArticle", async ctx => {
  let hotArticle = await Models.article.findAll({
    limit: 10,
    order: [["read", "DESC"]]
  });

  for (let i = 0; i < hotArticle.length; i++) {
    hotArticle[i].setDataValue("index", i + 1);
  }

  ctx.body = {
    hotArticle
  };
});

// 查询分类
router.post("/view/category", async ctx => {
  let category = await Models.category.findAll();
  for (let i = 0; i < category.length; i++) {
    let article = await Models.article.findAll({
      where: {
        categoryId: category[i].id
      }
    });
    category[i].setDataValue("articleLength", article.length);
  }

  ctx.body = {
    category
  };
});

// 分类查询文章
router.post("/view/categoryArticle", async ctx => {
  let pid = ctx.request.body.pid;
  let article = await Models.article.findAll({
    where: {
      categoryId: pid
    }
  });

  for (i = 0; i < article.length; i++) {
    let user = await Models.user.findById(article[i].userId);
    let category = await Models.category.findById(article[i].categoryId);
    let comments = await Models.comment.findAll({
      where: {
        articleId: article[i].id
      }
    });
    article[i].setDataValue("comment", comments);
    article[i].setDataValue("username", user.get("username"));
    article[i].setDataValue("category", category.get("name"));
  }

  ctx.body = {
    article
  };
});

// 查询文章详情并且更新文章查看数
router.post("/view/aboutArticle", async ctx => {
  let id = ctx.request.body.id;
  let article = await Models.article.findById(id);
  let comment = await Models.comment.findAll({
    where: {
      articleId: id
    }
  });
  let category = await Models.category.findAll({
    where: {
      id: article.categoryId
    }
  });

  if (comment.length !== 0) {
    for (let i = 0; i < comment.length; i++) {
      let user = await Models.user.findById(comment[i].userId);
      comment[i].setDataValue("avator", user.get("avator"));
    }
  }

  if (article !== null) {
    article.setDataValue("comment", comment);
    article.setDataValue("category", category[0].get("name"));

    Models.article.update(
      {
        read: article.read + 1
      },
      {
        where: {
          id
        }
      }
    );
  }
  ctx.body = {
    article
  };
});

// 点赞
router.post("/view/like", async ctx => {
  let id = ctx.request.body.id;
  let innocuous = ctx.request.body.innocuous;
  await Models.article.update(
    {
      innocuous: innocuous + 1
    },
    {
      where: {
        id
      }
    }
  );

  ctx.body = {
    message: "点赞成功"
  };
});

//友链
router.post("/view/friend", async ctx => {
  let friend = await Models.friend.findAll();

  ctx.body = {
    friend
  };
});

// 时光轴
router.post("/view/time", async ctx => {
  let time = await Models.time.findAll({
    order: [["createdAt", "DESC"]]
  });

  ctx.body = {
    time
  };
});

// 评论
router.post("/view/comment", async ctx => {
  const {
    userId,
    content,
    replyId,
    replyName,
    username,
    articleId,
    takens
  } = ctx.request.body;

  if (md5Taken !== takens) {
    ctx.body = {
      code: 203,
      message: "请先登录"
    };
    return;
  }
  await Models.comment.create({
    userId,
    content,
    replyId,
    replyName,
    username,
    articleId
  });

  let comment = await Models.comment.findAll({
    where: {
      articleId
    }
  });

  ctx.body = {
    comment
  };
});

// 登陆
router.post("/view/login", async ctx => {
  let { mobile, password } = ctx.request.body;
  let user = await Models.user.findAll({
    where: {
      mobile
    }
  });

  if (user.length === 0) {
    ctx.body = {
      message: "查无此人",
      code: 201
    };

    return;
  }

  if (MD5(user[0].get("password")) !== password) {
    ctx.body = {
      message: "密码错误",
      code: 201
    };

    return;
  }

  taken = randomString(6);
  md5Taken = MD5(taken)
  ctx.body = {
    taken,
    user: {
      name: user[0].get("username"),
      id: user[0].get("id"),
      avator: user[0].get("avator")
    },
    code: 200
  };

  return;
});

//图片上传路径
var storage = multer.diskStorage({
  //文件保存路径
  destination: function(req, file, cb) {
    cb(null, "./public/upload/user");
  },
  //修改文件名称
  filename: function(req, file, cb) {
    var fileFormat = file.originalname.split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
//加载配置
var upload = multer({ storage: storage });

router.post("/view/imgUpload", upload.single("file"), async (ctx, next) => {
  ctx.body = {
    filename: ctx.req.file.filename, //返回文件名
    imageUrl: "http://127.0.0.1:8888/" + ctx.req.file.path
  };
});

// 用户注册接口
router.post("/view/register", async ctx => {
  let { username, email, mobile, avator, password } = ctx.request.body;
  let user0 = await Models.user.findOne({
    where: {
      mobile
    }
  });

  if (user0 !== null) {
    ctx.body = {
      message: "该手机号已存在",
      code: 201
    };

    return;
  }

  let user1 = await Models.user.findOne({
    where: {
      email
    }
  });

  if (user1 !== null) {
    ctx.body = {
      message: "该邮箱已存在",
      code: 201
    };

    return;
  }

  await Models.user.create({
    username,
    email,
    mobile,
    avator,
    password,
    disabled: 0
  });

  let user = await Models.user.findOne({
    where: {
      mobile
    }
  });

  ctx.body = {
    code: 200,
    user: {
      name: user.get("username"),
      id: user.get("id"),
      avator: user.get("avator"),
      mobile: user.get("mobile")
    }
  };
});

// 留言接口
router.post("/view/criticsm", async ctx => {
  const {
    userId,
    username,
    replyId,
    replyName,
    content,
    takens
  } = ctx.request.body;

  

  if (userId) {
    if (md5Taken !== takens) {
      ctx.body = {
        code: 203,
        message: "请先登录"
      };
      return;
    }
    await Models.criticism.create({
      userId,
      username,
      replyId,
      replyName,
      content
    });
  }

  let criticsm = await Models.criticism.findAll();
  if (criticsm !== null) {
    ctx.body = {
      criticsm,
      code: 200
    };
    return;
  }

  ctx.body = {
    code: 201,
    message: "获取数据失败"
  };
});

// router.post('/view/criticsm',async ctx => {

// })
module.exports = router;
