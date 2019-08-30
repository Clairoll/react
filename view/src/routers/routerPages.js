import React from "react";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import Index from "../pages/view/index/index";
import List from "../pages/view/list/list";
import Comment from "../pages/view/comment/comment";
import Time from "../pages/view/time/time";
import Friend from "../pages/view/friend/friend";
import About from "../pages/view/about/about";
import Login from "../pages/view/login/login";
import Article from "../pages/view/article/article";

import Main from "../pages/view/main/main";
import notFound from "../pages/view/404";

export default class RouteMap extends React.Component {
  updateHandle() {
  }
  render() {
    return (
      <Router history={browserHistory} onUpdate={this.updateHandle.bind(this)}>
        <Route path="/" component={Index} />
        <Route path="/main" component={Main}>
          <IndexRoute component={List} />
          <Route path="/list" component={List} />
          <Route exact path="/comment" component={Comment} />
          <Route exact path="/time" component={Time} />
          <Route exact path="/friend" component={Friend} />
          <Route exact path="/about" component={About} />
          <Route exact path="/article" component={Article} />
        </Route>
        <Route exact path="/login" component={Login} />
        <Route path="*" component={notFound} />
      </Router>
    );
  }
}
