import React from 'react';
import { Paper, Card, CardContent, IconButton, Icon, Grid } from '@material-ui/core';

const styles = { 
    footer: {

    },
    gridSection: {
        
    },
    gridCard: {
        height: '20vh'
    }

};

class AppFoot extends React.Component {
    constructor(props) { super(props); }

    render() {
        return (
            <Paper className={this.props.footer} style={styles.footer}>
                <Grid container>
                    <Grid className={this.props.gridSection} item md={4}>
                       
                    </Grid>
                    <Grid className={this.props.gridSection} item md={4}>
                        
                    </Grid>
                    <Grid className={this.props.gridSection} item md={4}>
                        
                    </Grid>
                </Grid>
		    </Paper>
        );
    }
}

export default AppFoot;