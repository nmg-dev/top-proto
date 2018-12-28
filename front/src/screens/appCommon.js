import React from 'react';
import { Grid, AppBar, Toolbar, Typography } from '@material-ui/core';

import AppIndex from './appIndex.js';
import AppView from './appView.js';
import AppManage from './appManage.js';
import AppAdmin from './appAdmin.js';

import AppHead from './components/appHead.js';
import AppFoot from './components/appFoot.js';


const styles = {
    appContainer: {
		margin: 0,
		padding: 0,
    },
    appbar : {},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	toolbarItem: {
		display: 'inline-flex'
    },
    logo: {},
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
				
			case 'manage':
                return (<AppManage lang={this.props.lang} api={this.props.api} />);
            case 'view':
                return (<AppView lang={this.props.lang} api={this.props.api} />);
            case 'index':
            default:
                return (<AppIndex lang={this.props.lang} api={this.props.api} />);

		}
	}

    render() {
        return (
            <div style={styles.appContainer}>
                <AppBar position="sticky" style={styles.appbar}>
                    <Toolbar style={styles.toolbar}>
                        <div style={styles.toolbarItem}>
                            <Typography style={styles.logo}>TAG OPERATION by NMG</Typography>
                        </div>
                        <div style={styles.toolbarItem}>
                            {this.props.app.renderLanguageButton()}
                            {this.props.app.renderLanguageButtonMenu()}
                            {this.props.app.renderProfileButton()}
                            {this.props.app.renderProfileButtonMenu()}
                        </div>
                    </Toolbar>
                </AppBar>

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

