import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import Routes from '../config/routes';
import Header from 'components/Header';

import '../style/global.scss';

export default class App extends React.Component<any, any> {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div id="app-container" className="app-container">

					<Header />

					<div className="app-view" id="app-view">

						<HashRouter>
					 		<Routes />
					 	</HashRouter>

					</div>

				</div>
			</div>
		);
	}
	
}
