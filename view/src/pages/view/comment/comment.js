import React, { Component } from "react";
import CommentList from "../commentList/index";
import axios from "axios";
import { message,Card } from "antd";
import { browserHistory } from "react-router";
import utils from "../../utils/utils";
import "./comment.css";

class Comment extends Component {
  constructor() {
    super();
    this.state = {
      comments: [],
      params: {},
      content: ""
    };
  }

  componentDidMount() {
    this.fetchData({ url: "/api/view/criticsm"});
  }

  fetchData = ({ url = "", method = "post", data = {} }) => {
    axios({
      method,
      url,
      data,
    }).then(res => {
      if (res.status === 200 && res.data.code === 200) {
        this.setState({
          comments: res.data.criticsm
        });
      } else if(res.data.code === 203){
        message.error(res.data.message)
        browserHistory.push("/login");
      } else {
        message.error(res.data.message)
      }
    });
  };

  changeTextArea = value => {
    this.setState({
      content: value.comment,
      params: value
    });
  };

  // 回复评论
  ClickReplySubmit = () => {
    if ((!utils.getCookie("takens"))||(!utils.getItem('user'))) {
      message.error("请先登陆，登陆过后才能进行评价");
      browserHistory.push("/login");

      return;
    }
    const params = {
      userId: utils.getItem("user").id,
      content: this.state.content,
      replyId: this.state.params.replyid,
      replyName: this.state.params.replyname,
      username: utils.getItem("user").name,
      takens:utils.getCookie('takens')
    };
    this.fetchData({ url: "/api/view/criticsm", data: params });
  };

  // 发表评论
  ClickSubmit = () => {
    if ((!utils.getCookie("takens"))||(!utils.getItem('user'))) {
      message.error("请先登陆，登陆过后才能进行评价");
      browserHistory.push("/login");
      return;
    }
    const params = {
      userId: utils.getItem("user").id,
      content: this.state.content,
      replyId: 0,
      replyName: "",
      username: utils.getItem("user").name,
      takens:utils.getCookie('takens')
    };

    this.fetchData({ url: "/api/view/criticsm", data: params });
  };

  render() {
    const { comments } = this.state;
    return (
      <div id="comment">
        <div className="desc">
        <Card className="desc">
          <Card.Grid className="comment-item">
            <h2>留言说明:</h2>
            <p className="err">
              博主拥有一切优先权，禁止发表不当言论，定期清理，一经发现封号处理
            </p>
            <p>欢迎大家评论，以及交换链接</p>
          </Card.Grid>
        </Card>
        </div>
        <div className="comment-list">
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

export default Comment;
