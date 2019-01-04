import React from 'react';
import { Paper, Card, CardHeader, CardContent, Grid, TableHead, TableRow, TableBody, Table, TableCell, ListSubheader, ListItem, List, Chip, ListItemText, ListItemIcon, Icon } from '@material-ui/core';

import Plot from 'react-plotly.js';

const styles = {};

class AppIndex extends React.Component {
    constructor(props) {
        super(props);

        this._data = props.data;

        this.state = {
            pdata: {},
            playout: {
                width: '100%',
                height: '100%',
            },
            recommand: {},
        };

        this._data.addListener(this._onDataUpdated.bind(this));
    }

    componentDidMount() {
        this._onDataUpdated('affiliation');
    }

    _onDataUpdated(ev) {
        if(ev=='affiliation') {
            console.log('index data updated');
            let metric = this.props.tools.current.getMetric();
            this.setState({
                pdata: this._data.plotTimeSeries(metric),
                recommand: this._data.listTags('category')
                    .map((t)=>this._data.bestRecommandWith(t, metric))
            });
        }
    }

    render() {
        let ttIcons  = {
            layout: 'format_align_center',
            background: 'flip_to_back',
            objet: 'face',
            leat: 'favorite',
        }
        return (
            <Grid container spacing={8}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Plot data={this.state.pdata} layout={this.state.playout} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                {Object.keys(this.state.recommand)
                    .map((rc)=>this.state.recommand[rc])
                    .map((rcm)=> (
                        <Card>
                            <CardHeader title={rcm._title} />
                            <CardContent>
                                <List>
                                    {this._data.listTopTagClasses().map((tt) => 
                                        <ListItem>
                                            <ListItemIcon><Icon>{ttIcons[tt]}</Icon></ListItemIcon>
                                            <ListItemText
                                                primary={rcm[tt].name + ' ' + rcm[tt].value}
                                                secondary={tt}
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </CardContent>
                        </Card>
                ))}
                </Grid>
            </Grid>
        );
    }
}

export default AppIndex;
