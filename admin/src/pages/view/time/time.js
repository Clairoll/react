import React, { Component } from "react";
import { Breadcrumb, Table, Button, Modal, Input, Form, message } from "antd";
import axios from "../../utils/https";

import "./time.css";

const { confirm } = Modal;
const { TextArea } = Input;
const FormItem = Form.Item;
class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TableData: [],
      currentPage: 1,
      loading: false,
      showEdit: false,
      editId: null,
      time: {
        title: "",
        content: ""
      }
    };
    this.pageSize = 10;
  }
  componentDidMount() {
    this.fetchData();
  }

  renderTable = () => {
    const { state } = this;
    const tableColumns = [
      {
        title: "序号",
        dataIndex: "index",
        width: "10%"
      },
      {
        title: "主题",
        dataIndex: "title",
        width: "10%"
      },
      {
        title: "内容",
        dataIndex: "content",
        width: "60%",
        render: (text, row) => {
          return <div className="content">{text}</div>;
        }
      },
      {
        title: "操作",
        dataIndex: "operation",
        width: "20%",
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

  fetchData = (data = {}) => {
    axios({
      method: "post",
      url: "/admin/time",
      data: data
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          TableData: this.handleData(res.time)
        });
        if(data.id) {
          message.success("删除成功");
        }
      } else {
        message.error(res.messages)
      } 
    });
  };

  handleClickEdit = id => {
    axios({
      method: "post",
      url: "/admin/time/edit",
      data: {
        id
      }
    }).then(res => {
      if (res.code === 200) {
        this.setState({
          showEdit: true,
          type: "edit",
          editId: id,
          time: {
            title: res.time.title,
            content: res.time.content
          }
        });
      }else {
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
        content: values.content
      };

      if (!errors) {
        axios({
          method: "post",
          url: "/admin/time/edit",
          data: pramas
        }).then(res => {
          if (res.code === 200) {
            message.success("保存成功");
            this.setState({
              TableData: this.handleData(res.time0),
              showEdit: false,
              type: "",
              time: {
                title: "",
                content: ""
              }
            });
          } else {
            message.error(res.messages)
          } 
        });
      }
    });
  };

  handleClickDetele = row => {
    let _this = this;
    confirm({
      title: "确认删除条时光轴吗？",
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

  handleChangePage = cur => {
    this.setState({ currentPage: cur }, this.fetchData);
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
        content: values.content
      };

      if (!errors) {
        axios({
          method: "post",
          url: "/admin/time/add",
          data: pramas
        }).then(res => {
          if (res.code === 200) {
            message.success("添加成功");
            this.setState({
              TableData: this.handleData(res.time0),
              showEdit: false,
              type: "",
              friend: {
                title: "",
                content: ""
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
      time: {
        title: "",
        content: ""
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

  render() {
    const { state, props } = this;
    const { getFieldDecorator } = props.form;
    const title = state.type === "edit" ? "编辑时光轴" : "添加时光轴";
    const onok =
      state.type === "edit" ? this.hideModalEditOk : this.hideModalAddOk;
    return (
      <div id="time">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>时光轴</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
          <div style={{ paddingBottom: 24 }}>
            <Button
              value="large"
              type="primary"
              onClick={this.handleClickadd.bind(this)}
            >
              添加时光轴
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
            <FormItem label="主题">
              {getFieldDecorator("title", {
                initialValue: state.time.title,
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入主题"
                  }
                ]
              })(<Input placeholder="请输入主题" />)}
            </FormItem>
            <FormItem label="内容">
              {getFieldDecorator("content", {
                initialValue: state.time.content,
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入内容"
                  }
                ]
              })(
                <TextArea
                  placeholder="请输入内容"
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default (Time = Form.create({})(Time));
