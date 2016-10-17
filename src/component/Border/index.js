// CSS3 边框 
// index.js

import React from 'react';
import './border.less';
import BaseComponent from '../BaseComponent'
import {Link} from 'react-router';

export default class Border extends BaseComponent {
	render() {
		return (
			<div>
				<div className="border">
					<code>
					圆角：border-radius:25px;
					阴影：box-shadow: 10px 10px 3px #8888888;
					</code>
				</div>

				<Link to="/background">
					<div className="next">下一节</div>
				</Link>
			</div>

		);
	}
}