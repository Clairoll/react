import React, { Component } from "react";
import { Card } from "antd";

import axios from "axios";

import "./friend.css";
class Friend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: []
    };
  }
  componentDidMount() {
    axios({
      method: "post",
      url: "/api/view/friend"
    }).then(res => {
      if (res.status === 200) {
        this.setState({
          friends: res.data.friend
        });
      }
    });
  }
  render() {
    const { friends } = this.state;
    return (
      <div id="friend">
        <Card className="friend-card">
          <Card.Grid className="friend-item">
            <h2>链接申请说明:</h2>
            <p className="err">
              ×经常宕机 ×不合法规 ×插边球站 ×红标报毒 √原创优先 √技术优先
            </p>
            <p>名称：风雅</p>
            <p>网址：http://www.carioll.cn</p>
            <p>图标：http://www.carioll.cn/favicon.ico</p>
            <p>描述：一个浪荡的前端小白</p>
          </Card.Grid>
        </Card>

        <div className="list">
          {friends &&
            friends.map(item => {
              return (
                <div className="list-item" key={item.id}>
                  <div className="list-icon">
                    <img src={item.img} alt="图标" />
                    <div className="name">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.title}
                      </a>
                    </div>
                  </div>
                  <div />
                  <div className="list-content">
                        {item.content}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default Friend;
