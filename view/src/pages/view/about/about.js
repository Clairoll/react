import React, { Component } from "react";
import { List, Icon } from "antd";

import "./about.css";

class About extends Component {
  render() {
    return (
      <div id="about">
        <div className="container">
          <div className="about-left">
            <List className="about-list-item" header={<div>关于我</div>}>
              <List.Item>
                <Icon type="user" style={{ color: "green", marginRight: 10 }} />
                姓名:张明焰
              </List.Item>
              <List.Item>
                <Icon
                  type="heart"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
               性别:男
              </List.Item>
              <List.Item>
                <Icon
                  type="heart"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
               爱好:女
              </List.Item>
              <List.Item>
                <Icon
                  type="message"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                联系方式:1755033445@qq.com
              </List.Item>
              <List.Item>
                <Icon
                  type="idcard"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                职业:Web 前端实习生
              </List.Item>
            </List>

            <List className="about-list-item" header={<div>关于本站</div>}>
              <List.Item>
                <Icon type="tool" style={{ color: "green", marginRight: 10 }} />
                此博客纯本人手写，没有用到第三方建站工具
              </List.Item>
              <List.Item>
                <Icon
                  type="tags"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                用户端react+ant Design，管理端react+ant Design
              </List.Item>
              <List.Item>
                <Icon
                  type="tags"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                服务端node ,Sequelize ,koa
              </List.Item>
              <List.Item>
                <Icon
                  type="tags"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                数据库用的MySQL
              </List.Item>
              <List.Item>
                <Icon
                  type="bell"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                本站采用纯博主练手制作。
                只要在使用时注明出处，那么您可以可以对本站所有原创内容进行转载、节选、二次创作，但是您不得对其用于商业目的。
              </List.Item>
            </List>
          </div>
          <div className="about-right">
            <List className="about-list-item" header={<div>特别说明</div>}>
              <List.Item>
                <Icon
                  type="tags"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                本站文章仅代表个人观点，和任何组织或个人无关
              </List.Item>
              <List.Item>
                <Icon
                  type="tags"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                本站前端开发代码没有考虑对IE浏览器的兼容。
              </List.Item>
              <List.Item>
                <Icon
                  type="tags"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                用户邮箱仅作回复消息用，不对外使用。
              </List.Item>
            </List>
            <List className="about-list-item" header={<div>特别说明</div>}>
              <List.Item>
                <Icon
                  type="tags"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                本站文章仅代表个人观点，和任何组织或个人无关
              </List.Item>
              <List.Item>
                <Icon
                  type="tags"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                本站前端开发代码没有考虑对IE浏览器的兼容。
              </List.Item>
              <List.Item>
                <Icon
                  type="tags"
                  theme="filled"
                  style={{ color: "red", marginRight: 10 }}
                />
                用户邮箱仅作回复消息用，不对外使用。
              </List.Item>
            </List>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
