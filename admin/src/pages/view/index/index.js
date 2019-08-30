import React, { Component } from "react";
import { Breadcrumb, Card } from "antd";
import axios from "../../utils/https";
// import Echarts from "../echarts/echarts";
import echarts from "echarts/lib/echarts";
//引入柱状图
import "echarts/lib/chart/bar";
//引入折线图
import "echarts/lib/chart/line";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    axios({
      method: "get",
      url: "/admin/home",
      data: {}
    }).then(res => {
      let temp = [];
      for (let item in res) {
        temp.push(res[item]);
      }
      this.setState({
        data: temp
      });
    });
    this.renderEcharts();
  }

  renderEcharts = () => {
    var myChart = echarts.init(document.getElementById("main"));
    // 绘制图表
    myChart.setOption({
      title: { text: "网站数据统计" },
      tooltip: {},
      xAxis: {
        data: ["文章", "评论", "留言", "用户", "友情连接"]
      },
      yAxis: {},
      series: [
        {
          name: "详细数据",
          type: "line",
          data: this.state.data
        }
      ]
    });
  };

  render() {
    const { state } = this;
    return (
      <div>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
          <Card title="站长统计">
            <Card.Grid style={{ width: "20%", textAlign: "center" }}>
              {state.data[0]}篇文章
            </Card.Grid>
            <Card.Grid style={{ width: "20%", textAlign: "center" }}>
              {state.data[1]}条评论
            </Card.Grid>
            <Card.Grid style={{ width: "20%", textAlign: "center" }}>
              {state.data[2]}条留言
            </Card.Grid>
            <Card.Grid style={{ width: "20%", textAlign: "center" }}>
              {state.data[3]}个用户
            </Card.Grid>
            <Card.Grid style={{ width: "20%", textAlign: "center" }}>
              {state.data[4]}个友情连接
            </Card.Grid>
          </Card>

          <div
            id="main"
            style={{ width: 800, height: 400, margin: "30px auto" }}
          />
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    this.renderEcharts();
  }
}

export default Index;
