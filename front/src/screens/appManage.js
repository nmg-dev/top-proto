import React, { Component } from 'react';
import { Card, CardHeader, CardContent, CardActions, TextField, Grid, Icon, Button } from '@material-ui/core';

const styles = {

}

class AppManage extends Component {
	constructor(props) {
		super(props);
	}

	onFileSelect(ev) {
		console.log(ev.target.files);

		let reader = new FileReader();
		reader.onload = this.onFileLoad.bind(this);
		let filesToRead = ev.target.files;
		if(filesToRead && 0<filesToRead.length) {
			for(let fk in filesToRead) {
				if(filesToRead[fk] instanceof File) {
					console.log(filesToRead[fk]);
					reader.readAsText(filesToRead[fk]);
				}
			}
			
		}
	}

	onFileLoad(ev) {
		let lines = ev.target.result.split("\n")
		let values = [];
		let columns = [];
		lines.forEach((line) => {
			let tokens = line.split(/\t/g);
			if(columns.length<=0) {
				columns = tokens;
			} else {
				values.push(tokens);
			}
		});
		console.log(values);
	}

	render() {
		return (
			<Grid container>
				<Grid item xs={12}>
					<Card>
						<CardContent>
							<div>
							<input type="file" onChange={this.onFileSelect.bind(this)} />
							</div>
							<div>
								</div>
						</CardContent>
						<CardActions>
							<Button>Save</Button>
						</CardActions>
					</Card>
				</Grid>
				<Grid item xs={12}>
					<Card>
						<CardHeader>
							Campaigns
						</CardHeader>
						<CardContent>

						</CardContent>
					</Card>
				</Grid>
			</Grid>
		);
	}
}

export default AppManage;