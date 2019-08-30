import React, { Component } from "react";
import { Form, Icon, Input, Button, } from "antd";
import {browserHistory} from 'react-router'
import './login.css'
import axios from "../../utils/https";
import tool from '../../utils/tool'
class Login extends Component {

  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      axios({
        method:'post',
        url:'/admin/login',
        data:values
      }).then(res => {
        if(res.code === 200 ) {
          //"f1d3ff8443297732862df21dc4e57262"
          tool.setItem("user",res.user.username)
          tool.setItem("disabled",res.user.disabled)
          tool.setCookie('taken',res.Taken)
          browserHistory.push('/main')
        }
      })
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div id="login">
        <div className="login-center">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("username", {
                rules: [{ required: true, message: "请输入用户名" }]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "请输入密码" }]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登陆
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
export default (Login = Form.create({})(Login));
