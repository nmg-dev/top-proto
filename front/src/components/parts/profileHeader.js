import React, { Component } from 'react';
import { Typography, Avatar } from '@material-ui/core';

class ProfileHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.__loginBtn = React.createRef;
		this.__profiles = React.createRef;
	}

	renderLoginButton() {
		if(this.state.user) {
			return "";
		} else {
			return (
				
			)
		}
	}

	r

	render() {
		return(
			<div>
				{this.renderLoginButton}
				
		)
		console.log(this.state.user);
		if(this.state.user) {
			return (
				<div>
					
				</div>
			);
		} else {
			return (
				<div>
					
					
				</div>

			)
		}
	}
}

export default ProfileHeader;