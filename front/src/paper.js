import React, { Component } from 'react';
import { Paper } from '@material-ui/core';

class AbstractPaper extends Component {
	constructor(props) {
		super(props);

	}

	contents() {
		return 'unimplemented';
	}

	render() {
		if(this.state.isHidden)
			return '';
		else
			return (
				<Paper className={this.props.className|""}>
					{this.contents()}
				</Paper>
			);
	}
}


export default AbstractPaper;