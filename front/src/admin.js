import React from 'react';
// import { Paper } from '@material-ui/core';
import AuthPaper from './authPaper.js';

class Admin extends AuthPaper {
	constructor(props) {
		super(props);
	}

	contents() {
		return (<div>admin panel</div>);
	}


}

export default Admin;