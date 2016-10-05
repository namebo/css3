import React, {Component} from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import Home from './src/component/Home';
import Border from './src/component/Border';
import './src/css/index.less';

export default class App extends Component {
	render() {
		return (
			<div className="app">
				<div className="nav">
					<ul>
						<li><Link to="/home">首页</Link></li>
						<li><Link to="/border">CSS3 边框</Link></li>
						<li><Link to="/background">CSS3 背景</Link></li>
					</ul>
				</div>
				<div className="container">
					{this.props.children}
				</div>
			</div>			
		);
	}
}


render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="home" component={Home}/>
	  <Route path="border" component={Border}/>
      <Route path="*" component={Home}/>
    </Route>
  </Router>
), document.querySelector('#app'));
