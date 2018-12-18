import React, { Component } from 'react';
import { Card, CardHeader, CardContent, CardActions } from '@material-ui/core';

const styles = {
	loginPanel: {
		width: '100vw',
		height: '100vh',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
    loginCard: {
		display: 'flex',
		flexDirection: 'column',
		minWidth: '320px',
		minHeight: '300px',
		width: '30vw',
		height: '30vh',
	},
	loginCardHead: {
	},
	loginCardBody: {
	},
	loginCardFoot: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
}

class AppLogin extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={styles.loginPanel}>
				<Card className={this.loginCard} style={styles.loginCard}>
					<CardHeader className={this.loginScreenCardHeader} style={styles.loginCardHead}>
					</CardHeader>
					<CardContent className={this.loginCardBody} style={styles.loginCardBody}>
						<h1>TAG OPERATION</h1>
						Please Login
					</CardContent>
					<CardActions className={this.loginCardFoot} style={styles.loginCardFoot}>
						<div className="g-signin2" 
							data-onsuccess="_onGoogleLoginSuccess"
							data-onerror="_onGoogleLoginFailure"
						></div>
					</CardActions>
				</Card>
			</div>
		);
	}
}

export default AppLogin;