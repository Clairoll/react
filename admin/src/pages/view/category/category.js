import React, { Component } from "react";
import { Breadcrumb, Table, Button, Modal, Input, Select, message } from "antd";
import axios from "../../utils/https";

const Option = Select.Option;
const { confirm } = Modal;
class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TableData: [],
      currentPage: 1,
      loading: false,
      showModal: false,
      type: "",
      category: "",
      mainCategory: "",
      editId:null
    };
    this.pageSize = 10;
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData = (data = {}) => {
    axios({
      method: "post",
      url: "/admin/category",
      data: data
    }).then(res => {
      if(res.code === 200) {
        this.setState({
          TableData: this.handleData(res.category)
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
        title: "类别",
        dataIndex: "name"
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
                  onClick={this.showDeleteConfirm.bind(this, row.id)}
                  type="danger"
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
    const { state } = this;
    const title = state.type === "edit" ? "编辑友链" : "添加友链";
    const onok =
      state.type === "edit" ? this.hideModalEditOk : this.hideModalAddOk;
    return (
      <div>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>分类</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
          <div style={{ paddingBottom: 24 }}>
            <div>
              <Button type="primary" onClick={this.handleClickAdd}>
                添加分类
              </Button>
            </div>
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
          <Input
            size="large"
            value={state.category}
            placeholder="请输入类别"
            onChange={e => this.setState({ category: e.target.value })}
          />

          <Select
            placeholder="请选择所属主类"
            style={{ width: "100%", marginTop: 20 }}
            size="large"
            defaultValue={state.mainCategory}
            onChange={value => {
              this.setState({
                mainCategory: value
              });
            }}
          >
            {state.TableData.map((item, index) => (
              <Option key={index} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Modal>
      </div>
    );
  }

  handleClickAdd = () => {
    this.setState({
      showModal: true
    });
  };

  hideModalAddOk = () => {
    axios({
      method:"post",
      url:"/admin/category/add",
      data: {
        name:this.state.category,
        pid:this.state.mainCategory
      }
    }).then(res => {
      if(res.code !== 200) {
        message.error(res.messages)
      } else {
        this.setState({
          showModal:false,
          type:"",
          category:"",
          mainCategory:"",
          TableData:this.handleData(res.category0)
        })
        message.success("添加成功")
      }
    })

  };

  handleClickEdit = id => {
    axios({
      method:"post",
      url:"/admin/category/edit",
      data:{
        id
      }
    }).then(res=> {
      if(res.code === 200) {
        this.setState({
          type: "edit",
          showModal: true,
          editId:id,
          category:res.category.name,
          mainCategory:res.category.pid
        });
      } else {
        message.error(res.messages)
      }
    })
    
  };

  hideModalEditOk = () => {
    axios({
      method:"post",
      url:"/admin/category/edit",
      data:{
        id:this.state.editId,
        pid:this.state.mainCategory,
        name:this.state.category
      }
    }).then(res=> {
      if(res.code === 200) {
        this.setState({
          TableData:this.handleData(res.category0),
          type: "",
          showModal: false,
          category:"",
          mainCategory:""
        });
        message.success("编辑成功")
      } else {
        message.error(res.messages)
      }
    })
  };

  hideModalCacel = () => {
    this.setState({
      type: "",
      showModal: false,
      category:"",
      mainCategory:""
    });
  };

  showDeleteConfirm = row => {
    let _this = this;
    confirm({
      title: "确认删除该分类吗？",
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

export default Category;
