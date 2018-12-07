import React from 'react';
// import { Grid, Paper } from '@material-ui/core';
import AuthPaper from './authPaper.js';

class Manager extends AuthPaper {

	contents() {
		return (<h1>Manager</h1>);
	}
}

export default Manager;