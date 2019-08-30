import React from 'react'  
import { Router, Route ,IndexRoute,browserHistory} from 'react-router'
import Login from '../pages/view/login/login'
import Main from '../pages/view/Main'
import Index from '../pages/view/index/index'
import Article from "../pages/view/article/article";
import Writearticle from '../pages/view/article/writearticle'
import Comment from '../pages/view/comment/comment'
import Criticism from '../pages/view/criticism/criticism'
import Time from '../pages/view/time/time'
import Category from '../pages/view/category/category'
import User from '../pages/view/user/user'
import Friend from '../pages/view/friend/friend'
import notFound from '../pages/view/notfound'

export default class RouteMap extends React.Component {  
    updateHandle () {  
    }  
    render () {  
        return (  
            <Router history={browserHistory}  onUpdate={this.updateHandle.bind(this)}>  
                <Route path='/' component={Login} />
                <Route path='/main' component={Main}>
                    <IndexRoute component={Index}/>
                    <Route exact path='/index' component={Index}></Route>
                    <Route exact path='/article' component={Article}></Route>
                    <Route exact path='/writearticle' component={Writearticle}></Route>
                    <Route exact path='/comment' component={Comment}></Route>
                    <Route exact path='/criticism' component={Criticism}></Route>
                    <Route exact path='/time' component={Time}></Route>
                    <Route exact path='/category' component={Category}></Route>
                    <Route exact path='/user' component={User}></Route>
                    <Route exact path='/friend' component={Friend}></Route>
                </Route> 
                <Route path='*' component={notFound}></Route>
            </Router>  
        )  
    }  
}  
