import React, { Component } from "react";
import axios from "axios";
import { message } from "antd";
import utils from "../../utils/utils";
import "./time.css";

class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
      times: []
    };
  }
  componentDidMount() {
    axios({
      method: "post",
      url: "/api/view/time"
    }).then(res => {
      if (res.status === 200) {
        this.setState({
          times: res.data.time
        });
        this.callbackFunc();
      } else {
        message.error("查询失败");
      }
    });

    window.addEventListener("scroll", this.callbackFunc);
  }

  isElementInViewport = el => {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  callbackFunc = () => {
    var items = document.querySelectorAll(".timeline li");
    for (var i = 0; i < items.length; i++) {
      if (this.isElementInViewport(items[i])) {
        if (!items[i].classList.contains("in-view")) {
          items[i].classList.add("in-view");
        }
      } else if (items[i].classList.contains("in-view")) {
        items[i].classList.remove("in-view");
      }
    }
  };

  renderLi = () => {
    const { times } = this.state;
    return times.map(item => {
      return (
        <li key={item.id}>
          <div className="timeLine-item">
            <div className="header">
              <span className="title">{item.title}</span>
              <span className="time">{utils.formatDate(item.createdAt,"yyyy-MM-dd")}</span>
            </div>
            <div className="content">
              {item.content}
            </div>
          </div>
        </li>
      );
    });
  };
  render() {
    const { times } = this.state;
    return (
      <div className="timeline">
        <ul>{times && this.renderLi()}</ul>
      </div>
    );
  }
}

export default Time;
