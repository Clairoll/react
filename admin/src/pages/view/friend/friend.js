import React, { Component } from "react";
import { Breadcrumb, Table, Button, message, Modal, Input, Form } from "antd";
import axios from "../../utils/https";

import "./friend.css";

const { confirm } = Modal;
const { TextArea } = Input;
const FormItem = Form.Item;
class Friend extends Component {
  constructor() {
    super();
    this.state = {
      TableData: [],
      currentPage: 1,
      loading: false,
      showEdit: false,
      editId: null,
      friend: {
        title: "",
        content: "",
        img: "",
        url: ""
      }
    };
    this.pageSize = 10;
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData = (data = {}) => {
    axios({
      method: "post",
      url: "/admin/friend",
      data: data
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          TableData: this.handleData(res.friend)
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
        title: "网站名称",
        dataIndex: "title"
      },
      {
        title: "网站简介",
        dataIndex: "content"
      },
      {
        title: "网站图标",
        dataIndex: "img",
        render: (text, row) => {
          return text ? (
            <div className="img">
              <img src={text} alt="" />
            </div>
          ) : (
            "-"
          );
        }
      },

      {
        title: "网站网址",
        dataIndex: "url"
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

  render() {
    const { state, props } = this;
    const { getFieldDecorator } = props.form;
    const title = state.type === "edit" ? "编辑友链" : "添加友链";
    const onok =
      state.type === "edit" ? this.hideModalEditOk : this.hideModalAddOk;

    return (
      <div id="friend">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>友情链接</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
          <div style={{ paddingBottom: 24 }}>
            <Button
              value="large"
              type="primary"
              onClick={this.handleClickadd.bind(this)}
            >
              添加友链
            </Button>
          </div>
          {this.renderTable()}
        </div>

        <Modal
          title={title}
          visible={state.showEdit}
          onOk={onok}
          onCancel={this.hideModalEditCacel}
          okText="确认"
          cancelText="取消"
          destroyOnClose={true}
        >
          <Form onSubmit={this.hideModalEditOk}>
            <FormItem label="网站名称">
              {getFieldDecorator("title", {
                initialValue: state.friend.title,
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入网站名称"
                  }
                ]
              })(<Input placeholder="请输入网站名称" />)}
            </FormItem>
            <FormItem label="网站简介">
              {getFieldDecorator("content", {
                initialValue: state.friend.content,
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入网站简介"
                  }
                ]
              })(
                <TextArea
                  placeholder="请输入网站简介"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              )}
            </FormItem>
            <FormItem label="网站图标地址">
              {getFieldDecorator("img", {
                initialValue: state.friend.img,
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入网站图标地址"
                  }
                ]
              })(
                <TextArea
                  placeholder="请输入网站图标地址"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              )}
            </FormItem>
            <FormItem label="网站链接">
              {getFieldDecorator("url", {
                initialValue: state.friend.url,
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入网站链接"
                  }
                ]
              })(
                <TextArea
                  placeholder="请输入网站链接"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }

  handleClickEdit = id => {
    axios({
      method: "post",
      url: "/admin/friend/edit",
      data: {
        id
      }
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          showEdit: true,
          type: "edit",
          editId: id,
          friend: {
            title: res.friend.title,
            content: res.friend.content,
            img: res.friend.img,
            url: res.friend.url
          }
        });
      } else {
        message.error(res.messages)
      }
    });
  };

  hideModalEditOk = e => {
    e.preventDefault();
    const { props, state } = this;

    props.form.validateFieldsAndScroll({ force: true }, (errors, values) => {
      let pramas = {
        title: values.title,
        id: state.editId,
        img: values.img,
        content: values.content,
        url: values.url
      };

      if (!errors) {
        axios({
          method: "post",
          url: "/admin/friend/edit",
          data: pramas
        }).then(res => {
          if (res.code === 200) {
            message.success("保存成功");
            this.setState({
              TableData: this.handleData(res.friend0),
              showEdit: false,
              type: "",
              friend: {
                title: "",
                content: "",
                img: "",
                url: ""
              }
            });
          } else {
            message.error(res.messages)
          }
        });
      }
    });
  };

  hideModalEditCacel = () => {
    this.setState({
      showEdit: false,
      type: "",
      friend: {
        title: "",
        content: "",
        img: "",
        url: ""
      }
    });
  };

  handleClickadd = () => {
    this.setState({ showEdit: true });
  };

  hideModalAddOk = e => {
    e.preventDefault();
    const { props } = this;
    props.form.validateFieldsAndScroll({ force: true }, (errors, values) => {
      let pramas = {
        title: values.title,
        img: values.img,
        content: values.content,
        url: values.url
      };

      if (!errors) {
        axios({
          method: "post",
          url: "/admin/friend/add",
          data: pramas
        }).then(res => {
          if (res.code === 200) {
            message.success("添加成功");
            this.setState({
              TableData: this.handleData(res.friend0),
              showEdit: false,
              type: "",
              friend: {
                title: "",
                content: "",
                img: "",
                url: ""
              }
            });
          } else {
            message.error(res.messages)
          }
        });
      }
    });
  };

  handleClickDetele = id => {
    let _this = this;
    confirm({
      title: "确认删除该友链吗？",
      content: "一旦删除不可恢复，请仔细确认",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        _this.fetchData({ id });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  handleData = datas => {
    for (let i = 0; i < datas.length; i++) {
      datas[i].index = i + 1;
      datas[i].key = i;
    }

    return datas;
  };

  handleChangePage = cur => {
    this.setState({ currentPage: cur }, this.fetchData);
  };
}

export default (Friend = Form.create({})(Friend));
