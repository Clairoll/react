import React, { Component } from "react";
import axios from "axios";
import { message, Typography, Icon } from "antd";
import marked from "marked";
import hljs from "highlight.js";
import { browserHistory } from "react-router";
import utils from "../../utils/utils";
import CommentList from "../commentList/index";

import "./article.css";

import "highlight.js/styles/github.css";

hljs.initHighlightingOnLoad();
var rendererMD = new marked.Renderer();

marked.setOptions({
  renderer: rendererMD,
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  },
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: "",
      content: "",
      comment: "",
      comments: [],
      params: {}
    };
  }
  componentDidMount() {
    axios({
      method: "post",
      url: "/api/view/aboutArticle",
      data: {
        id: this.props.location.query.code
      }
    }).then(res => {
      if (res.status === 200 && res.data.article !== null) {
        this.setState({
          article: res.data.article,
          content: res.data.article.content,
          comments: res.data.article.comment
        });
      } else {
        message.error("数据请求失败，或者文章不存在");
      }
    });
  }

  // 点赞
  // handleClickLike = (id, innocuous) => {
  //   axios({
  //     method: "post",
  //     url: "/view/like",
  //     data: {
  //       id,
  //       innocuous
  //     }
  //   }).then(res => {
  //   });
  // };

  changeTextArea = value => {
    this.setState({
      comment: value.comment,
      params: value
    });
  };

  // 发表评论
  ClickSubmit = () => {
    if ((!utils.getCookie("takens"))||(!utils.getItem('user'))) {
      message.error("请先登陆，登陆过后才能进行评价");
      browserHistory.push("/login");

      return;
    }
    axios({
      method: "post",
      url: "/api/view/comment",
      data: {
        userId: utils.getItem("user").id,
        content: this.state.comment,
        username: utils.getItem("user").name,
        articleId: this.props.location.query.code,
        takens:utils.getCookie('takens')
      }
    }).then(res => {
      if(res.data.code === 203){
        message.error(res.data.message)
        browserHistory.push("/login");
        return
      }
      this.setState({
        comments: res.data.comment
      });
    });
  };

  // 回复评论
  ClickReplySubmit = () => {
    if ((!utils.getCookie("takens"))||(!utils.getItem('user'))) {
      message.error("请先登陆，登陆过后才能进行评价");
      browserHistory.push("/login");

      return;
    }
    axios({
      method: "post",
      url: "/api/view/comment",
      data: {
        userId: utils.getItem("user").id,
        content: this.state.comment,
        replyId: this.state.params.replyid,
        replyName: this.state.params.replyname,
        username: utils.getItem("user").name,
        articleId: this.props.location.query.code,
        takens:utils.getCookie('takens')
      }
    }).then(res => {
      if(res.data.code === 203){
        message.error(res.data.message)
        browserHistory.push("/login");
        return
      }
      this.setState({
        comments: res.data.comment
      });
    });
  };
  render() {
    const { article, content, comments } = this.state;
    return (
      <div id="aboutArticle">
        <div className="article">
          <div className="header">
            <div className="title">
              <span>{article.title}</span>
            </div>
            <div className="time">
              <span>发布时间:{utils.formatDate(article.createdAt)}</span>
            </div>
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          />
          <div className="footer">
            <div className="card-desc">
              <div>
                <span>
                  <Icon type="tag" theme="filled" />
                  <Typography.Text mark>{article.category}</Typography.Text>
                </span>
              </div>
              <div>
                <span style={{ marginRight: 25 }}>
                  <Icon type="eye" theme="filled" />
                  {article.read}
                </span>

                {/* <span
                  onClick={this.handleClickLike.bind(
                    this,
                    article.id,
                    article.innocuous
                  )}
                >
                  <Icon type="like" theme="filled" />
                  {article.innocuous}
                </span> */}
              </div>
            </div>
          </div>
        </div>
        <div className="comment">
          <CommentList
            comments={comments}
            onChange={this.changeTextArea}
            ClickReplySubmit={this.ClickReplySubmit}
            ClickSubmit={this.ClickSubmit}
          />
        </div>
      </div>
    );
  }
}

export default Article;
