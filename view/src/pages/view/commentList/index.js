import React, { Component } from "react";
import { Button, Card, Input } from "antd";
import utils from "../../utils/utils";
import "./index.css";
const { TextArea } = Input;

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      comment: [],
      showInput: false,
      replyid: 0,
      replyname: "",
      replayValue: ""
    };
  }
  changeTextArea = e => {
    const comment = e.target.value;
    const { replyid, replyname } = this.state;
    let parmas = {
      comment,
      replyid,
      replyname
    };
    this.setState(
      {
        value: comment,
      },
      () => {
        const { onChange } = this.props;
        onChange(parmas);
      }
    );
  };

  changeReplyTextArea = e => {
    const comment = e.target.value;
    const { replyid, replyname } = this.state;
    let parmas = {
      comment,
      replyid,
      replyname
    };
    this.setState(
      {
        replayValue: comment
      },
      () => {
        const { onChange } = this.props;
        onChange(parmas);
      }
    );
  };

  handleTreeData = id => {
    const { comments } = this.props;
    let datas = comments.filter(item => item.replyId === id);
    datas.forEach(item => {
      item.children = this.handleTreeData(item.id);
    });
    return datas;
  };

  handelClicksubmit = ()=> {
    const { ClickSubmit,ClickReplySubmit } = this.props;
    const {value} = this.state    
    if(value !== '') {
      ClickSubmit()
      this.setState({
        value:'',
      })
    }else {
      ClickReplySubmit()
      this.setState({
        replayValue:''
      })
    }
    
  }

  renderReplyModel = () => {
    const { value } = this.state;
    return (
      <div className="input">
        <div className="input-item">
          <TextArea rows={4} value={value} onChange={this.changeTextArea} />
          <Button type="primary" onClick={this.handelClicksubmit}>
            评论
          </Button>
        </div>
      </div>
    );
  };

  renderCommentList = () => {
    let comment = this.handleTreeData(0);
    const { showInput, replyid, replayValue } = this.state;
    return comment.map(item => {
      return (
        <Card className="list-card" key={item.id}>
          <Card.Grid className="list-item">
            <div className="item-container">
              <div className="item-avator">
                <img
                  src={
                    item.avator
                      ? item.avator
                      : require("../../../images/avator.jpeg")
                  }
                  alt="啊哈哈"
                />
              </div>
              <div className="item-content">
                <div>
                  <span className="username">{item.username}</span>
                </div>
                <div className="title">{item.content}</div>
                <div>
                  <span className="time">
                    {utils.formatDate(item.createdAt)}
                  </span>
                  <span
                    className="reply"
                    onClick={this.handleClickReply.bind(
                      this,
                      item.id,
                      item.username
                    )}
                  >
                    回复
                  </span>
                </div>
              </div>
            </div>
            {item.children.length !== 0 && (
              <div className="replay-list">
                {item.children.map(item1 => {
                  return (
                    <div key={item1.id}>
                      <div className="item-container">
                        <div className="item-avator">
                          <img
                            src={
                              item1.avator
                                ? item1.avator
                                : require("../../../images/avator.jpeg")
                            }
                            alt="啊哈哈"
                          />
                        </div>
                        <div className="item-content">
                          <div>
                            <span className="username">{item1.username}</span>
                            <span style={{ paddingLeft: 5, paddingRight: 5 }}>
                              回复
                            </span>
                            <span className="username">{item1.replyName}</span>
                          </div>
                          <div className="title">{item1.content}</div>
                          <div>
                            <span className="time">
                              {utils.formatDate(item1.createdAt)}
                            </span>
                            <span
                              className="reply"
                              onClick={this.handleClickReply.bind(
                                this,
                                item.id,
                                item.username
                              )}
                            >
                              回复
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {showInput && replyid === item.id && (
              <div className="input">
                <div className="input-item">
                  <TextArea
                    rows={4}
                    value={replayValue}
                    onChange={this.changeReplyTextArea}
                  />
                  <Button type="primary" onClick={this.handelClicksubmit}>
                    评论
                  </Button>
                </div>
              </div>
            )}
          </Card.Grid>
        </Card>
      );
    });
  };

  handleClickReply = (id, name) => {
    let bool = this.state.showInput ? false : true;
    this.setState({
      showInput: bool,
      replyid: id,
      replyname: name
    });
  };

  render() {
    return (
      <div id="comment-list">
        {this.renderReplyModel()}
        <div className="list">{this.renderCommentList()}</div>
      </div>
    );
  }
}

export default CommentList;
