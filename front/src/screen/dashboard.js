import React from 'react';
import Querybar from '../component/querybar';
import CardPanel from '../component/cardpanel';
import { Line } from 'react-chartjs-2';

const styles = {
    container: { 
        margin: 16,
        padding: 16,
        width: '100vw',
    },
}

const samples_design = [
    {c: 'Background', t: '무색'},
    {c: 'Objet', t: '모델'},
    {c: 'Layout', t: '중앙배치형'},
    {c: 'Button type', t: '타임형'},
];

const samples_topic = [
    {c: 'Key topic', t: '프리미엄'},
    {c: 'Keyword', t: '할인율 표기'},
    {c: 'Trigger', t: '리워드 강조'},
    {c: 'Ad Copy', t: '주목형'},
];

const sample_data = [
    { x: 1,	y: 500},
    { x: 2,	y: 426},
    { x: 3,	y: 602},
    { x: 4,	y: 737},
    { x: 5,	y: 725},
    { x: 6,	y: 616},
    { x: 7,	y: 598},
    { x: 8,	y: 767},
    { x: 9,	y: 869},
    { x: 10, y: 664},
    { x: 11, y: 693},
    { x: 12, y: 745},
];

class DashboardScreen extends React.Component {
    constructor(ps) {
        super(ps);
        this.state = {};
    }

    renderElementCard(cls, title) {
        return (<div class="section col-3">
            <h5 class="section-title">{cls}</h5>
            <div class="section-text">{title}</div>
        </div>);
    }

    renderContent() {
        return (<div class="flex-container">
            <div class="row">
                <div class="col"><h3 class="panel-title">Best Creative Element</h3></div>
            </div>
            <div class="row">
                {samples_design.map((d)=>this.renderElementCard(d.c, d.t))}
            </div>
            <div class="row">
                {samples_topic.map((d)=>this.renderElementCard(d.c, d.t))}
            </div>
            <div class="row">
                <div class="col">
                    <Line data={sample_data} />
                </div>
            </div>
        </div>);
    }

    render() {
        return (<div className="container-flex" style={styles.container}>
                <div className="row">
                    <Querybar />
                </div>
                <div className="row">
                    <CardPanel 
                        body={this.renderContent()} />
                </div>
            </div>);
    }
}

export default DashboardScreen;