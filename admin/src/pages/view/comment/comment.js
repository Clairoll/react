import React, { Component } from "react";
import { Breadcrumb, Table, Button, message,Modal } from "antd";
import axios from "../../utils/https";

const { confirm } = Modal;
class Comment extends Component {
  constructor(props){
    super(props);
    this.state= {
      TableData:[],
      commentList:[],
      currentPage: 1,
      loading:false
    }
    this.pageSize= 10
  }
  componentDidMount() {
    this.fetchData()
  }
  fetchData= (data={})=> {
    axios({
      method:"post",
      url:"/admin/comment",
      data:data
    }).then(res => {
      if(res.code === 200) {
        this.setState({
          TableData:this.handleData(res)
        })
        if( data.id) {
          message.success("删除成功")
        }
      } else {
        message.error(res.messages)
      }
    })
  }
  renderTable = () => {
    const { state } = this;
    const tableColumns = [
      {
        title: "序号",
        dataIndex: "index"
      },
      {
        title: "评论人",
        dataIndex: "username"
      },
      {
        title: "评论文章",
        dataIndex: "articleTitle"
      },
      {
        title: "内容",
        dataIndex: "content",
        render: (text, row) => {
          return <div className="content">{text}</div>;
        }
      },
      {
        title: "操作",
        dataIndex: "delete",
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
  
  handleClickDetele=(row)=> {
    let _this = this;
    confirm({
      title: "确认删除该评论吗？",
      content: "一旦删除不可恢复，请仔细确认",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        _this.fetchData({ id:row });
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  handleChangePage=(cur)=> {
    this.setState({ currentPage: cur }, this.fetchData)
  }

  handleData=(datas)=>{
    for (let i =0; i< datas.comment.length; i++) {
      datas.comment[i].articleTitle = datas.articletitle[i];
      datas.comment[i].index = i+1;
      datas.comment[i].key = i;
    }

    return datas.comment
  }

  render() {
    return (
      <div>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>言论</Breadcrumb.Item>
          <Breadcrumb.Item>评论</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
          {this.renderTable()}
        </div>
      </div>
    );
  }
}

export default Comment;
