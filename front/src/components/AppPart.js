import React from 'react';

class AppPart extends React.Component {
	constructor(props, app) {
		super(props);
		this._app = app;
	}

	/* abstact placeholders */
	// on app stage changed
	onAppStageUpdated(stage, prevStage=null) { return null; }
}

export default AppPart;