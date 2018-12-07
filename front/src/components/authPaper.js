import React from 'react';
// import { Paper } from '@material-ui/core';
import AbstractPaper from './paper.js'

class AuthPaper extends AbstractPaper {
	constructor(prop) {
		super(prop);
		this.state = {
			isHidden: true
		}
	}
}

export default AuthPaper;