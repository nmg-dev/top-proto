import React, { Component } from 'react';
import { Card, CardHeader, CardContent, CardActions, TextField, Grid, Icon, Button } from '@material-ui/core';

const styles = {

}

class AppManage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Grid container>
				<Card>
					<CardHeader 
						avatar={<Icon>plus</Icon>}
						title="NEW Campaign"
					/>
					<CardContent>
						<TextField label="campaign title" />
						<TextField label="campaign account" />
					</CardContent>
					<CardActions>
						<Button>SUBMIT</Button>
						<Button>UPLOAD</Button>
						<Button>CANCEL</Button>
					</CardActions>
				</Card>
			</Grid>
		);
	}
}

export default AppManage;