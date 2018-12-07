import React from 'react';
import { Styles } from '@material-ui/core';

class AppComponent extends React.Component {
	
	constructor(props, app) {
		super(props);
		this._app = app;
	}



	/* abstact placeholders */
	// on app stage changed
	onAppStageUpdated(stage, prevStage=null) { return null; }
	// app style
	static getStyle() { return {}; }
}

export default Styles.withStyles(AppComponent.getStyle())(AppComponent);