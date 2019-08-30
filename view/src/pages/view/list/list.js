import React, { Component } from "react";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  Icon,
  List,
  Typography,
  /*{Carousel}*/ message
} from "antd";
import { browserHistory } from "react-router";

import "./list.css";

// const { Content, Sider } = Layout;
class Lists extends Component {
  constructor() {
    super();
    this.state = {
      article: [],
      category: [],
      hotArticle: []
    };
  }
  componentDidMount() {
    this.fetchData({ url: "/api/view/article", attr: ["article"] });
    this.fetchData({ url: "/api/view/hotArticle", attr: ["hotArticle"] });
    this.fetchData({ url: "/api/view/category", attr: ["category"] });
  }

  fetchData = async ({ url = "", method = "post", data = {}, attr = [] }) => {
    await axios({
      method,
      url,
      data
    }).then(res => {
      if (res.status === 200) {
        for (let i = 0; i < attr.length; i++) {
          this.setState({
            [attr[i]]: res.data[attr[i]]
          });
        }
      } else {
        message.error("很抱歉，数据请求失败");
      }
    });
  };

  renderArticle = () => {
    const { article } = this.state;
    return article.map(item => {
      return (
        <Col span={24} key={item.id} className="fadeInUpLeft animated">
          <Card title={item.title} className="card">
            <Card.Grid className="card-item">
              <div
                className="card-header"
                onClick={this.handleClickArtice.bind(this, item.id)}
              >
                <div className="img">
                  <img src={item.img} alt="该文章的图片走丢了哦" />
                </div>
                <div className="card-content">{item.desc}</div>
              </div>
              <div className="card-footer">
                <div className="card-desc">
                  <div style={{ float: "left" }}>
                    <span>
                      <Icon
                        type="tag"
                        theme="filled"
                        style={{ paddingRight: 2 }}
                      />
                      <Typography.Text mark>{item.category}</Typography.Text>
                    </span>
                  </div>
                  <div style={{ float: "right" }}>
                    <span style={{ marginRight: 35 }}>
                      <Icon
                        type="eye"
                        theme="filled"
                        style={{ paddingRight: 2 }}
                      />
                      {item.read}
                    </span>

                    <span>
                      <Icon
                        type="message"
                        theme="filled"
                        style={{ paddingRight: 2 }}
                      />
                      {item.comment.length}
                    </span>
                  </div>
                </div>
              </div>
            </Card.Grid>
          </Card>
        </Col>
      );
    });
  };

  handleClickCategory = id => {
    this.fetchData({
      url: "/api/view/categoryArticle",
      data: { pid: id },
      attr: ["article"]
    });
  };

  handleClickArtice = id => {
    browserHistory.push(`/article?code=${id}`);
  };

  // 渲染轮播图
  //   renderCarousel = () => {
  //       return(
  //         <Carousel autoplay>
  //             <div>
  //               <img src={require("../../../images/walkingdead.png")} alt="" />
  //             </div>
  //             <div>
  //               <h3>2</h3>
  //             </div>
  //             <div>
  //               <h3>3</h3>
  //             </div>
  //             <div>
  //               <h3>4</h3>
  //             </div>
  //           </Carousel>
  //       )
  //   }
  render() {
    const { category, hotArticle } = this.state;
    return (
      <div id="list">
        {/* <div className="carousel">
          {this.renderCarousel()}
        </div> */}
        <div className="list-container">
          <div className="content">
            <Row>{this.renderArticle()}</Row>
          </div>
          <div className="sider">
            <List className="stationmaster" header={<div>站长信息</div>}>
              <div className="stationmaster-avator">
                <img
                  src={require("../../../images/avator.jpeg")}
                  alt="站长帅照"
                />
              </div>
              <List.Item>姓名：张</List.Item>
              <List.Item>职业：Web 前端实习生</List.Item>
              <List.Item>邮箱：1755033445@qq.com</List.Item>
            </List>
            <List
              header={<div>文章分类</div>}
              bordered
              className="category"
              dataSource={category}
              renderItem={item => (
                <List.Item
                  onClick={this.handleClickCategory.bind(this, item.id)}
                >{`${item.name}(${item.articleLength})`}</List.Item>
              )}
            />

            <List
              header={<div>热门文章</div>}
              bordered
              className="hotArticle"
              dataSource={hotArticle}
              renderItem={item => (
                <List.Item onClick={this.handleClickArtice.bind(this, item.id)}>{`${item.index}. ${item.title}`}</List.Item>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Lists;
