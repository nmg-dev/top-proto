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
        let metric = (this.props.tools.current) ? this.props.tools.current.getMetric() : this._data.defaultMetric();
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
                                <Table>
                                    <TableHead>
                                        <TableCell>cls</TableCell>
                                        <TableCell>option</TableCell>
                                        <TableCell>{metric.key}</TableCell>
                                        <TableCell>sample</TableCell>
                                    </TableHead>
                                    <TableBody>
                                    {this._data.listTopTagClasses().map((tt) => 
                                        (<TableRow>
                                            <TableCell>{this.props.app.lang.tr(tt)}</TableCell>
                                            <TableCell>{this.props.app.lang.tr(tt+'.'+rcm[tt].name)}</TableCell>
                                            <TableCell>{rcm[tt].value}</TableCell>
                                            <TableCell>
                                                <img src={rcm[tt].sample} alt="sample" />
                                            </TableCell>
                                        </TableRow>)
                                    )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                ))}
                </Grid>
            </Grid>
        );
    }
}

export default AppIndex;
