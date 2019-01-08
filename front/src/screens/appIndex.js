import React from 'react';
import { Card, CardHeader, CardContent, Grid, TableHead, TableRow, TableBody, Table, TableCell } from '@material-ui/core';

import Plot from 'react-plotly.js';

const styles = {
    plot: {width: '95%', height: '100%'},
    indexCard: {margin: '2vh'},
    tableSample: {maxWidth: '40vw', objectFit: 'cover'},
};

class AppIndex extends React.Component {
    constructor(props) {
        super(props);

        this._data = props.data;

        this.state = {
            pdata: {},
            playout: { },
            recommand: {},
        };

        this._refs = {
            chart: React.createRef(),
        };

        this._data.addListener(this._onDataUpdated.bind(this));
    }

    componentDidMount() {
        this._onDataUpdated('affiliation');
        // this._refs.chart.resizeHandler();
    }

    _onDataUpdated(ev) {
        if(ev=='affiliation') {
            console.log('index data updated');
            let metric = this.props.tools.current.getMetric();
            this.setState({
                pdata: this._data.plotTimeSeries(metric),
                playout: {
                    autosize: true,
                    showlegend: false,
                    xaxis: { 
                        autorange: true,
                        rangeslider: { range: this.props.tools.current.periodRange() },
                        type: 'date'
                    },
                    yaxis: {
                        type: 'percent',
                    }
                },
                recommand: this._data.listTags('category')
                    .map((t)=>this._data.bestRecommandWith(t, metric))
            });
        }
    }

    renderPlotCard() {
        return (<Card style={styles.indexCard}>
            <CardContent>
                <Plot 
                    data={this.state.pdata} 
                    layout={this.state.playout} 
                    useResizeHandler={true} 
                    ref={this._refs.chart}
                    style={styles.plot} />
            </CardContent>
        </Card>);
    }
    renderRecommandTable(rcm, metric) {
        return (
            <Card style={styles.indexCard}>
                <CardHeader title={this.props.app.lang.tr('category.'+rcm._title)} />
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>cls</TableCell>
                                <TableCell>option</TableCell>
                                <TableCell>{metric.key}</TableCell>
                                <TableCell>sample</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {this._data.listTopTagClasses().map((tt) => 
                            (<TableRow key={tt}>
                                <TableCell>{this.props.app.lang.tr(tt)}</TableCell>
                                <TableCell>{this.props.app.lang.tr(tt+'.'+rcm[tt].name)}</TableCell>
                                <TableCell>{rcm[tt].value}</TableCell>
                                <TableCell>
                                    <img src={rcm[tt].sample} alt="sample" style={styles.tableSample} />
                                </TableCell>
                            </TableRow>)
                        )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>);
    }

    render() {
        let metric = (this.props.tools.current) ? this.props.tools.current.getMetric() : this._data.defaultMetric();
        return (
            <Grid item xs={12}>
                {this.renderPlotCard()}
                {Object.keys(this.state.recommand)
                    .map((rc)=>this.state.recommand[rc])
                    .map((rcm)=>this.renderRecommandTable(rcm, metric))}
            </Grid>
        );
    }
}

export default AppIndex;
