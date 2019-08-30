import React, { Component } from "react";
import { Breadcrumb, Table, Button,Modal,message } from "antd";
import axios from "../../utils/https";
import { browserHistory } from "react-router";
import "./article.css";

const { confirm } = Modal;
class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TableData: [],
      currentPage: 1,
      loading: false
    };
    this.pageSize = 10;
  }
  componentDidMount() {
    this.fetchData({url: "/admin/article", attr:'TableData'});
  }

  fetchData = ({ url = "", method = "post", data = {}, attr="" }) => {
    axios({
      method,
      url,
      data
    }).then(res => {
      console.log(res)
      if (res.code === 200) {
        this.setState({
          [attr]: this.handleData(res.article)
        });
        if(data.id) {
          message.success('删除成功')
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
        title: "标题",
        dataIndex: "title"
      },
      {
        title: "作者",
        dataIndex: "username"
      },
      {
        title: "内容",
        dataIndex: "content",
        render: (text, row) => {
          return <div className="content">{text}</div>;
        }
      },
      {
        title: "图片",
        dataIndex: "img",
        render: (text, row) => {
          return (
            <div className="img">
              <img src={text} alt="图片" />
            </div>
          );
        }
      },
      {
        title: "分类",
        dataIndex: "category"
      },
      {
        title: "点赞",
        dataIndex: "innocuous"
      },
      {
        title: "浏览",
        dataIndex: "read"
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
    return (
      <div id="article">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>文章</Breadcrumb.Item>
          <Breadcrumb.Item>文章列表</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
          <div style={{ paddingBottom: 24 }}>
            <Button
              value="large"
              type="primary"
              onClick={this.handleClickadd.bind(this)}
            >
              写文章
            </Button>
          </div>
          {this.renderTable()}
        </div>
      </div>
    );
  }

  handleClickEdit = row => {
    browserHistory.push("/writearticle?id="+row);
  };

  handleClickadd = () => {
    browserHistory.push("/writearticle");
  };

  handleClickDetele = row => {
    let _this = this;
    confirm({
      title: "确认删除该文章吗？",
      content: "一旦删除不可恢复，请仔细确认",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        _this.fetchData({url: "/admin/article", attr:'TableData',data:{id:row}});;
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

export default Article;
