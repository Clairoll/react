import React, { Component } from "react";
import { Link } from "react-router";
import { Layout, Menu } from "antd";
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }
  render() {
    const { Header, Content, Footer, Sider } = Layout;
    const { SubMenu } = Menu;
    const defaultUsername = "admin";
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div
            className="logo"
            style={{
              margin: "20px auto",
              width: 120,
              height: 120,
              textAlign: "center"
            }}
          >
            <img
              src={require("../assets/images/avator.jpg")}
              alt="头像"
              style={{ width: 80, height: 80, borderRadius: "50%" }}
            />
            <p style={{ fontSize: 24, color: "#fff", marginTop: 5 }}>
              {localStorage.getItem("username") || defaultUsername}
            </p>
          </div>
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1">
              <Link to={"index"}>首页</Link>
            </Menu.Item>
            <SubMenu key="sub1" title="文章">
              <Menu.Item key="2">
                <Link to={"article"}>所有文章</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to={"writearticle"}>写文章</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title="言论">
              <Menu.Item key="4">
                <Link to={"comment"}>评论</Link>
              </Menu.Item>
              <Menu.Item key="5">
                <Link to={"criticism"}>留言</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="6">
              <Link to={"time"}>时光轴</Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to={"category"}>分类</Link>
            </Menu.Item>
            <Menu.Item key="8">
              <Link to={"user"}>用户管理</Link>
            </Menu.Item>
            <Menu.Item key="9">
              <Link to={"friend"}>友情链接</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }} />
          <Content style={{ margin: "0 16px" }}>
            {this.props.children}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            <p>Copyright © 2019 风雅随笔 ALL RIGHT RESERVED </p>
            <p>联系方式：1755033445@qq.com</p>
            <p>皖ICP备19004477号</p>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Main;
