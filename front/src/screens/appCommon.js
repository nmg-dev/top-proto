import React from 'react';
import { Grid } from '@material-ui/core';

import AppView from './appView.js';
import AppManage from './appManage.js';
import AppAdmin from './appAdmin.js';

import AppHead from './components/appHead.js';
import AppFoot from './components/appFoot.js';

const styles = {
    appContainer: {
		margin: 0,
		padding: 0,
	}
}

class AppCommon extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            stage: 'view',
            tags: {},
            campaigns: {},
        }
    }

    componentDidMount() {
        

        // retrieve values

        // 
    }

    updateStage(nextStage) {
        this.setState({stage: nextStage})
    }
    
	renderStage() {
		switch(this.state.stage) {
			case 'admin':
				return (<AppAdmin lang={this.props.lang} api={this.props.api} />);
			case 'manage':
				return (<AppManage lang={this.props.lang} api={this.props.api} />);
			case 'view':
			default:
				return (<AppView lang={this.props.lang} api={this.props.api} />);

		}
	}

    render() {
        return (
            <div className={this.props.appContainer} style={styles.appContainer}>
                <AppHead user={this.props.user} updateStage={this.updateStage.bind(this)} updateLocale={this.props.updateLocale} />
                <Grid container>
                    <Grid item xs={12}>
                        {this.renderStage()}
                    </Grid>
                </Grid>
                <AppFoot />
            </div>
        )
    }
}

export default AppCommon;

