import React, { Component } from 'react';
import { Tabs,Tab,TabContainer, Grid, Paper, Card, CardHeader, IconButton, Icon, Collapse, CardContent, Toolbar, TextField, Checkbox, MenuItem, Table, TableHead, TableRow, Divider, TableCell, TableBody, FormControl, InputLabel, Button } from '@material-ui/core';

const styles = {

}

const DEFAULT_INDICES = [
	'cid', 'date', 'impression', 'click', 'conversion', 'cost',
];

const ATTRIBUTE_INDICES = [
	'title', 'category','goal', 'channel', 'media',
	'layout', 'background', 'objet', 'lead',
];

class AppManage extends Component {
	constructor(props) {
		super(props);
		this.state={
			mode: "upload", 
			delimiter: ",",
			includeHeader: true,
			columns: DEFAULT_INDICES,
		}

		this._data = this.props.data;
		this._refs = {
			fin: React.createRef()
		};
	}

	_renderContentTableHeader() {
		return (
			<TableHead>
				<TableRow>
					<TableCell>#</TableCell>
					{this.state.columns.map((col, idx)=>(<TableCell>
						<TextField select key={col.name} value={col.index} label={col.name} index={idx}
							InputLabelProps={{shrink: true}}
							onChange={(ev) => {
								console.log(ev.target);
								// let cols = Object.assign(this.state.columns);
								// let i = parseInt(ev.target.getAttribute('index'));
								// let v = ev.target.value;
								// cols[i].index = v;
								// this.setState({columns: cols});
							}}>
							<MenuItem key="" value={null}>(IGNORE)</MenuItem>
							{!this.state.includeHeader ? '' :<MenuItem key="" value={col.name}>{col.name} (AS-IS)</MenuItem>}
							<Divider />
							{DEFAULT_INDICES.map((d)=>(
								<MenuItem key={d} value={d}>{this.props.app.lang.tr(d)}</MenuItem>
							))}
							<Divider />
							{ATTRIBUTE_INDICES.map((d)=>(
								<MenuItem key={d} value={d}>{this.props.app.lang.tr(d)}</MenuItem>
							))}
							<Divider />
							{this._data.listTagClasses().map((d) =>(
								<MenuItem key={d} value={d}>{this.props.app.lang.tr(d)}</MenuItem>
							))}
						</TextField>
					</TableCell>))}
				</TableRow>
			</TableHead>
		);
	}

	_renderContentTableBody() {
		return (<TableBody>
			{this.state.contents.filter((l,no)=>no<20)
				.map((line, no) => (<TableRow>
					<TableCell><sub>{no+1}:</sub></TableCell>
					{line.split(this.state.delimiter)
						.map((tok,ti) => (<TableCell key={ti}>{tok.trim()}</TableCell>))}
			</TableRow>))}
		</TableBody>);
	}

	renderContentTable() {
		if(!this.state.contents)
			return '';

		return (
			<Table>
				{this._renderContentTableHeader()}
				{this._renderContentTableBody()}
			</Table>
		)
	}

	_parseLineColumns(lines) {
		let columns;
		if(!lines || lines.length<=0) return DEFAULT_INDICES;

		if(this.state.includeHeader) {
			columns = lines[0].split(this.state.delimiter).map((_c, i, arr)=>{
				console.log(_c,i);
				_c = _c.trim();
				let c = _c.toLowerCase();
				if(0<=DEFAULT_INDICES.indexOf(c)) {
					return {name: _c, index: c, parser: null};
				}
				else if(0<=ATTRIBUTE_INDICES.indexOf(c)) {
					return {name: _c, index: c, parser: null};
				}
				// in case with attribution instead of campaign_id
				else if(DEFAULT_INDICES.length+ATTRIBUTE_INDICES.length-1<=arr.length) {
					if(i<DEFAULT_INDICES.length-1)
						return {name: _c, index: DEFAULT_INDICES[i+1], parser: null};
					else if(i<=DEFAULT_INDICES.length+ATTRIBUTE_INDICES.length-1)
						return {name: _c, index: ATTRIBUTE_INDICES[i-DEFAULT_INDICES.length+1], parser: null};
					else
						return {name: _c, index: null, parser: null};
				}
				// or with campaign_id instead of attribution
				else if(DEFAULT_INDICES.length <= arr.length) {
					return {name: _c, index: DEFAULT_INDICES[i], parser: null};
				}
				// nothing here
				else {
					return {name: _c, index: null, parser: null};
				}
			});
		} else {
			let maxCols = lines.reduce((mc,line) => mc = Math.max(mc, line.split(this.state.delimiter).length), 0);
			if(maxCols<=DEFAULT_INDICES.length)
				columns = DEFAULT_INDICES.slice(0, maxCols).map((c,i) => { return {
					name: 'col'+i.toLocaleString(),
					index: c, parser: null,
				}});
			else 
				columns = DEFAULT_INDICES.splice(0, 1)
					.concat(ATTRIBUTE_INDICES)
					.filter((c,i)=>i<maxCols)
					.map((c,i)=> {
					return { name: 'col'+i.toLocaleString(), index: c, parser: null }
				});
		}
		
		return columns;
	}

	onFileLoad(ev) {
		let lines = ev.target.result.split("\n")
			.map((l)=>l.trim())
			.filter((l)=>0<l.length);
		//
		this.setState({
			contents: lines,
			columns: this._parseLineColumns(lines)
		});	
	}

	onOpenFileSelector(ev) {
		this._refs.fin.current.click();
	}

	onOpenFileComplete(ev) {
		if(!ev.target.files || ev.target.files.length<=0) {
			this.setState({file: null});
			return;
		}

		// console.log(ev.target.files);
		let reader = new FileReader();
		reader.onload = this.onFileLoad.bind(this);
		let theFile = ev.target.files[0];
		reader.readAsText(theFile);

		this.setState({file: theFile});
	}

	_startLoadingProgress() {

	}

	_validateFileContents() {
		if(!this.state.file) return false;
		if(!DEFAULT_INDICES.reduce(
			(pass, idx)=> { 
				console.log(pass, idx);
				return pass && (idx=='cid'||0<=this.state.columns.indexOf(idx))
			},
			true))  {
				console.error('NO sufficient columns', this.state.columns);
				return false;
			}
		if(this.state.columns.indexOf('cid')<0) {
			console.error('NO attribute columns and cid', this.state.columns);
			return ATTRIBUTE_INDICES.reduce((pass, idx)=> pass && 0<=this.state.columns.indexOf(idx), true);
		}

		console.log('validating', this.state.columns);
		
		return true;
	}

	renderModeUploadTools() {
		return (<CardContent>
				<Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
					<div>
						<FormControl>
							<InputLabel shrink={true}>header</InputLabel>
							<Checkbox 
								label="Header"
								name="includeHeader" 
								checked={this.state.includeHeader}
								onChange={()=>{
									this.setState({includeHeader: !this.state.includeHeader,})
								}} />
						</FormControl>
						<TextField select name="delimiter" 
							label="Separator"
							value={this.state.delimiter}
							onChange={(ev)=>{
								this.setState({delimiter: ev.target.value});
							}}>
							<MenuItem key="comma" value={','}>,</MenuItem>
							<MenuItem key="tab" value={'\t'}>\t (tab)</MenuItem>
							<MenuItem key="pipe" value={'|'}>| (pipe)</MenuItem>
						</TextField>
					</div>
					<div>
						<Button 
							onClick={this._startLoadingProgress.bind(this)}>
						SAVE</Button>
					</div>
				</Toolbar>
			</CardContent>);
	}

	renderModeUpload() {
		return (
			<Card>
				<CardHeader
					subheader={this.state.file ? this.state.file.name : ''}
					title={<IconButton onClick={this.onOpenFileSelector.bind(this)}>
						<Icon>backup</Icon>
						<input type="file" style={{display: 'none'}} 
							ref={this._refs.fin} 
							onInput={this.onOpenFileComplete.bind(this)}
							accept=".txt,.csv,.tsv"
						/>
					</IconButton>}
				/>
				{this.renderModeUploadTools()}
				
				<Collapse in={this.state.file!=null}>
					<CardContent>
						{this.renderContentTable()}
					</CardContent>
				</Collapse>


			</Card>
		);
	}

	renderModeManage() {
		return 'manage mode';
	}

	renderTabContainer() {
		switch(this.state.mode) {
			case 'manage':
				return this.renderModeManage();
			case 'upload':
			default:
				return this.renderModeUpload();
		}
	}

	render() {
		return (
			<Grid item xs={12}>
				<Tabs value={this.state.mode}>
					<Tab label="upload" value="upload" onClick={()=>this.setState({mode: 'upload'})} />
					<Tab label="manage" value="manage" onClick={()=>this.setState({mode: 'manage'})} />
				</Tabs>
				<Paper>
					{this.renderTabContainer()}
				</Paper>
			</Grid>
		);
	}
}

export default AppManage;