import React, { Component } from "react";
import {
  Breadcrumb,
  Table,
  Button,
  Switch,
  Input,
  Form,
  message,
  Modal
} from "antd";
import axios from "../../utils/https";
import Avatar from "../../utils/imgUpload";

const { confirm } = Modal;
const FormItem = Form.Item;
class User extends Component {
  constructor() {
    super();
    this.state = {
      TableData: [],
      currentPage: 1,
      loading: false,
      ckecked: false,
      showModal: false,
      user: {
        username: "",
        phone: "",
        email: ""
      },
      type: "",
      editId: ""
    };
    this.pageSize = 10;
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData = (data = {}) => {
    axios({
      method: "post",
      url: "/admin/user",
      data: data
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          TableData: this.handleData(res.user)
        });

        if(data.id) {
          message.success("删除成功")
        }
      } else {
        message.error(res.messages)
      }
    });
  };

  renderTable = () => {
    const { state } = this;
    const tableColumns = [
      {
        title: "序号",
        dataIndex: "index"
      },
      {
        title: "名字",
        dataIndex: "username"
      },
      {
        title: "头像",
        dataIndex: "avator",
        render: (text, row) => {
          return (
            <div>
              <img style={{ width: 80, height: 80 }} src={text} alt="图片" />
            </div>
          );
        }
      },
      {
        title: "手机",
        dataIndex: "mobile"
      },
      {
        title: "邮箱",
        dataIndex: "email"
      },
      {
        title: "权限",
        dataIndex: "disabled",
        render: (text, row) => {
          return (
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={row.disabled}
              onClick={checked => this.handleClickSwitch(checked, row.id)}
            />
          );
        }
      },
      {
        title: "操作",
        dataIndex: "operation",
        children: [
          {
            title: "编辑",
            dataIndex: "edit",
            align: "center",
            render: (text, row) => {
              return (
                <Button
                  type="primary"
                  size="large"
                  onClick={this.handleClickEdit.bind(this, row.id)}
                >
                  编辑
                </Button>
              );
            }
          },
          {
            title: "删除",
            dataIndex: "delete",
            align: "center",
            render: (text, row) => {
              return (
                <Button
                  type="danger"
                  size="large"
                  onClick={this.handleClickDetele.bind(this, row.id)}
                >
                  删除
                </Button>
              );
            }
          }
        ]
      }
    ].map(e => ({ ...e, align: "center" }));

    return (
      <Table
        dataSource={state.TableData}
        columns={tableColumns}
        loading={state.loading}
        bordered
        pagination={{
          showQuickJumper: true,
          total: state.TableData.length,
          pageSize: this.pageSize,
          current: state.currentPage,
          onChange: this.handleChangePage,
          showTotal: total => (
            <span>
              共有<span style={{ color: "#1890ff" }}>{total}</span>
              条记录
            </span>
          )
        }}
      />
    );
  };

  handleClickDetele = row => {
    let _this = this;
    confirm({
      title: "确认删除该用户吗？",
      content: "一旦删除不可恢复，请仔细确认",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        _this.fetchData({ id: row });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  handleClickEdit = id => {
    axios({
      method: "post",
      url: "/admin/user/edit",
      data: {
        id
      }
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          showModal: true,
          user: {
            username: res.user[0].username,
            phone: res.user[0].mobile,
            email: res.user[0].email
          },
          type: "edit",
          editId: res.user[0].id
        });
      }
    });
  };

  hideModalEditOk = e => {
    e.preventDefault();
    const { props, state } = this;
    let pramas = {};
    props.form.validateFieldsAndScroll({ force: true }, (errors, values) => {
      pramas = {
        username: values.username,
        id: state.editId,
        mobile: values.phone,
        email: values.email
      };

      if (!errors) {
        axios({
          method: "post",
          url: "/admin/user/edit",
          data: pramas
        }).then(res => {
          console.log(res)
          if (res.code === 200) {
            message.success("保存成功");
            this.setState({
              TableData: this.handleData(res.user0),
              showModal: false,
              user: {
                username: "",
                phone: "",
                email: ""
              }
            });
          } else {
            message.error(res.messages)
          }
        });
      }
    });
  };

  handleClickadd = () => {
    this.setState({
      showModal: true
    });
  };

  hideModalAddOk = e => {
    e.preventDefault();
    const { props } = this;
    let pramas = {};
    props.form.validateFieldsAndScroll({ force: true }, (errors, values) => {
      pramas = {
        username: values.username,
        mobile: values.phone,
        email: values.email,
        avator: values.imageUrl
      };

      if (!errors) {
        axios({
          method: "post",
          url: "/admin/user/add",
          data: pramas
        }).then(res => {
          if (res.code === 200) {
            message.success("添加成功");
            this.setState({
              TableData: this.handleData(res.user),
              showModal: false,
              user: {
                username: "",
                phone: "",
                email: ""
              }
            });
          } else {
            message.error(res.messages);
          }
        });
      }
    });
  };

  hideModalCacel = () => {
    this.setState({
      showModal: false,
      user: {
        username: "",
        phone: "",
        email: ""
      },
      type: ""
    });
  };

  handleClickSwitch = (checked, id) => {
    let _this = this;
    confirm({
      title: "确认修改该用户的权限吗？",
      content: "一旦修改可能会造成不必要的影响",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
       
          axios({
            method: "post",
            url: "/admin/user/permissions",
            data: {
              disableds: checked,
              id
            }
          }).then(res => {
            if (res.code === 200) {
              message.success("修改成功");
              _this.setState({
                TableData: _this.handleData(res.user0)
              });
            } else {
              message.error(res.messages)
            }
          });
        
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  handleChangePage = cur => {
    this.setState({ currentPage: cur }, this.fetchData);
  };

  handleData = datas => {
    for (let i = 0; i < datas.length; i++) {
      datas[i].index = i + 1;
      datas[i].key = i;
    }
    return datas;
  };

  render() {
    const { state, props } = this;
    const { getFieldDecorator } = props.form;
    const title = state.type === "edit" ? "编辑用户" : "添加用户";
    const onok =
      state.type === "edit" ? this.hideModalEditOk : this.hideModalAddOk;
    return (
      <div id="user">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>用户管理</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
          <div style={{ paddingBottom: 24 }}>
            <Button
              value="large"
              type="primary"
              onClick={this.handleClickadd.bind(this)}
            >
              添加用户
            </Button>
          </div>
          {this.renderTable()}
        </div>

        <Modal
          title={title}
          visible={state.showModal}
          onOk={onok}
          onCancel={this.hideModalCacel}
          okText="确认"
          cancelText="取消"
          destroyOnClose={true}
        >
          <Form onSubmit={this.hideModalEditOk}>
            <FormItem label="用户名">
              {getFieldDecorator("username", {
                initialValue: state.user.username,
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入用户名"
                  }
                ]
              })(<Input placeholder="请输入用户名" />)}
            </FormItem>
            {state.type !== "edit" && (
              <FormItem label="头像">
                {getFieldDecorator("imageUrl", {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入图片地址"
                    }
                  ]
                })(<Avatar imageUrl={state.imageUrl} />)}
              </FormItem>
            )}

            <FormItem label="手机号">
              {getFieldDecorator("phone", {
                initialValue: state.user.phone,
                rules: [
                  {
                    whitespace: true,
                    required: true,
                    message: "请输入手机号"
                  },
                  {
                    validator: (rule, value, callback) => {
                      let phoneReg = /^1[3456789]\d{9}$/;
                      if (!phoneReg.test(value)) {
                        callback("请输入手机号");
                      }
                      callback()
                    }
                  }
                ]
              })(<Input placeholder="请输入手机号" />)}
            </FormItem>
            <FormItem label="邮箱">
              {getFieldDecorator("email", {
                initialValue: state.user.email,
                rules: [
                  {
                    whitespace: true,
                    required: true,
                    message: "请输入邮箱"
                  },
                  {
                    validator: (rule, value, callback) => {
                      let emaliReg = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+/;
                      if (!emaliReg.test(value)) {
                        callback("请输入邮箱");
                      }
                      callback()
                    }
                  }
                ]
              })(<Input placeholder="请输入邮箱" />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default (User = Form.create({})(User));
