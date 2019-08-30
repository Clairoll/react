import React, { Component } from "react";
import { Layout } from "antd";
import { Link } from "react-router";
import utils from "../../utils/utils";

import "./main.css";

const { Header, Footer, Content } = Layout;
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      avator: ""
    };
  }

  componentDidMount() {
    let user = utils.getItem("user");
    if (user) {
      this.setState({
        username: user.name,
        avator: user.avator
      });
    }
  }

  checked = data => {
    let checked = window.location.pathname;
    return checked === data ? "checked" : "dischecked";
  };

  handelClickLoginOut = () => {
    utils.removeItem("user");
    utils.removeCookie('takens')
    this.setState({
      username: "",
      avator: ""
    });
  };

  render() {
    const avator =
      this.state.avator === ""
        ? require("../../../images/avator.jpeg")
        : this.state.avator;
    return (
      <Layout>
        <Header id="header">
          <div className="header-container">
            <div className="header-main">
              <div className={this.checked("/")}>
                <Link to={"/"}>首页</Link>
              </div>

              <div className={this.checked("/list")}>
                <Link to={"list"}>博文</Link>
              </div>

              <div className={this.checked("/comment")}>
                <Link to={"comment"}>留言</Link>
              </div>

              <div className={this.checked("/time")}>
                <Link to={"time"}>时光轴</Link>
              </div>

              <div className={this.checked("/friend")}>
                <Link to={"friend"}>圈子</Link>
              </div>

              <div className={this.checked("/about")}>
                <Link to={"about"}>关于我</Link>
              </div>

              {this.state.username === "" ? (
                <React.Fragment>
                  <div className="dischecked">
                    <Link to={"login"}>登陆 |</Link>
                    <Link to={`login?code=''`}> 注册</Link>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="avator">
                    <img src={avator} alt="用户" />
                    <span onClick={this.handelClickLoginOut}>退出</span>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </Header>
        <Content id="Content" style={{ minHeight: 720 }}>
          {this.props.children}
        </Content>
        <Footer style={{ textAlign: "center", background: "#fff" }}>
          <p>Copyright © 2019 风雅随笔 ALL RIGHT RESERVED </p>
          <p>联系方式：1755033445@qq.com</p>
          <p>皖ICP备19004477号</p>
        </Footer>
      </Layout>
    );
  }
}

export default Main;
