import React, { Component } from "react";
import { Form, Icon, Input, Button, message } from "antd";
import Canvans from "../canvans/canvans";
import { browserHistory } from "react-router";
import axios from "axios";
import md5 from "md5";
import utils from "../../utils/utils";
import ImgUpload from "../imgUpload/imgUpload";
import "./login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.location.query.code || "login",
      mobile: '',
      password:''
    };
  }

  fetchData = async ({ url = "", method = "post", data = {} }) => {
    await axios({
      method,
      url,
      data
    }).then(res => {
      if (res.status !== 200 || res.data.code !== 200) {
        message.error(res.data.message);
        return;
      }
      if (this.state.type === "login") {
        utils.setCookie('takens',md5(res.data.taken))
        utils.setItem("user", res.data.user);
        browserHistory.push("/list");
      } else {
        this.setState({
          type:'login',
          mobile:res.data.user.mobile,
          password:res.data.user.password
        })
      }
    });
  };

  handleLoginSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {
          mobile: values.mobile,
          password: md5(values.password)
        };
        this.fetchData({ url: "/api/view/login", data: params });
      }
    });
  };

  handleRegisterSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {
          avator: values.avator,
          username: values.username,
          mobile: values.mobile,
          password: values.password,
          email: values.email
        };
        this.fetchData({ url: "/api/view/register", data: params });
      }
    });
  };

  handleGoBack = () => {
    browserHistory.push("/list");
  };

  renderLogin = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="model">
        <Form onSubmit={this.handleLoginSubmit} className="login-from">
          <h2>登陆</h2>
          <Form.Item className="login-item">
            {getFieldDecorator("mobile", {
              initialValue:this.state.mobile,
              rules: [
                { required: true, whitespace: true, message: "请输入手机号" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="mobile" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="手机号"
                size="large"
              />
            )}
          </Form.Item>

          <Form.Item className="login-item">
            {getFieldDecorator("password", {
              initialValue:this.state.password,
              rules: [
                { required: true, whitespace: true, message: "请输入密码" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="密码"
                size="large"
              />
            )}
          </Form.Item>

          <Form.Item className="login-item ">
            <Button
              className="login-button"
              type="primary"
              htmlType="submit"
              size="large"
            >
              登陆
            </Button>
          </Form.Item>
          <div className="other">
            <div>
              <span type="primary" size="large" onClick={this.handleGoBack}>
                算了没啥想登陆的，还是回去逛逛吧
              </span>
            </div>
            <div>
              <span
                type="primary"
                size="large"
                onClick={this.handleClickLoginToRegister}
              >
                还没有账号，立即注册？
              </span>
            </div>
          </div>
        </Form>
      </div>
    );
  };

  handleClickLoginToRegister = () => {
    this.setState({
      type: ""
    });
  };

  handleClickRegisterToLogin = () => {
    this.setState({
      type: "login"
    });
  };

  renderRegister = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="model">
        <Form onSubmit={this.handleRegisterSubmit} className="login-from">
          <h2>请完善个人信息</h2>
          <Form.Item className="register-item">
            {getFieldDecorator("avator", {
              rules: [
                { required: true, whitespace: true, message: "请上传头像" }
              ]
            })(<ImgUpload />)}
          </Form.Item>

          <Form.Item className="register-item">
            {getFieldDecorator("username", {
              rules: [
                { required: true, whitespace: true, message: "请输入用户名" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="用户名"
                size="large"
              />
            )}
          </Form.Item>

          <Form.Item className="register-item">
            {getFieldDecorator("mobile", {
              rules: [
                { required: true, whitespace: true, message: "请输入手机号" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="mobile" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="手机号"
                size="large"
              />
            )}
          </Form.Item>

          <Form.Item className="register-item">
            {getFieldDecorator("email", {
              rules: [
                { required: true, whitespace: true, message: "请输入邮箱" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="mobile" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="邮箱"
                size="large"
              />
            )}
          </Form.Item>

          <Form.Item className="register-item">
            {getFieldDecorator("password", {
              rules: [
                { required: true, whitespace: true, message: "请输入密码" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="密码"
                size="large"
              />
            )}
          </Form.Item>

          <Form.Item className="login-item ">
            <Button
              className="login-button"
              type="primary"
              htmlType="submit"
              size="large"
            >
              提交
            </Button>
          </Form.Item>
          <div className="other">
            <div>
              <span type="primary" size="large" onClick={this.handleGoBack}>
                算了没啥想注册的，还是回去逛逛吧
              </span>
            </div>
            <div>
              <span
                type="primary"
                size="large"
                onClick={this.handleClickRegisterToLogin}
              >
                已有账号，立即登陆？
              </span>
            </div>
          </div>
        </Form>
      </div>
    );
  };
  render() {
    return (
      <div id="login">
        <Canvans />
        <div>
          {this.state.type === "login"
            ? this.renderLogin()
            : this.renderRegister()}
        </div>
      </div>
    );
  }
}

// export default Login;
export default (Login = Form.create({})(Login));
