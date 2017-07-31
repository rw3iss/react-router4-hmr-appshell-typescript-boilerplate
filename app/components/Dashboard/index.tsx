import * as React from 'react';
import LocalStorageModule from 'lib/LocalStorageModule';

const ls = new LocalStorageModule();

export default class Dashboard extends React.Component<any, any> {

	constructor(props: any) {
		super(props);
		this.state = {
			testy: 'test'
		}
	}

	componentDidMount() {
		console.log('Dashboard mounted.');
		this.setState({
			testy: ls.getObject<string>('testy')
		});
	}

	render() {
		var self = this;
		var test = this.state.testy;
		
		return (
			<div className="container">
            	Dashboard:
				{ test }
    		</div>
		);
	}

}
