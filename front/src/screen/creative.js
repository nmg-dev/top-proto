import React from 'react';
import Querybar from '../component/querybar';
import CardPanel from '../component/cardpanel';
import CategoryBar from '../component/categorybar';
import Plot from 'react-plotly.js';
import DropBtn from '../component/dropbtn';

const bar_colors = ['#D9D9D9','#002060','#9DC3E6','#1F4E79','#20ADE3',];
var sample_data = [
    {title: 'Layout', labels: ['중앙','좌우','우측','좌측'], data: [168,194,243,435]},
    {title: 'Background', labels: ['밝은단색','무색','면분할','어두운단색'], data: [112,204,271,320]},
    {title: 'Objet', labels: ['일러스트','모델','실사','없음'], data: [121,172,256,318]},
    {title: 'Button type', labels: ['혜택형','유도형','타임형'], data: [204,231,242]},

    {title: 'Key topic', labels: ['중앙','좌우','우측','좌측'], data: [168,194,243,435]},
    {title: 'Keyword', labels: ['밝은단색','무색','면분할','어두운단색'], data: [112,204,271,320]},
    {title: 'Trigger', labels: ['일러스트','모델','실사','없음'], data: [121,172,256,318]},
    {title: 'Ad Copy', labels: ['혜택형','유도형','타임형'], data: [204,231,242]},

    {title: 'Attribution1', labels: ['중앙','좌우','우측','좌측'], data: [168,194,243,435]},
    {title: 'Attribution2', labels: ['밝은단색','무색','면분할','어두운단색'], data: [112,204,271,320]},
    {title: 'Attribution3', labels: ['일러스트','모델','실사','없음'], data: [121,172,256,318]},
    {title: 'Attribution4', labels: ['혜택형','유도형','타임형'], data: [204,231,242]},
];

// reverse order
sample_data = sample_data.map((dv)=>{
    dv.labels = dv.labels.reverse();
    dv.data = dv.data.reverse();
    return dv;
});

class CreativeScreen extends React.Component {
    constructor(ps) {
        super(ps);
        this.state = {};

        //
        
    }

    renderContent() {
        return (<div class="flex-container">
            <div class="row">
                <div class="col">
                    <h1 class="panel-title">Element Analysis</h1>
                    <h5 class="panel-subtitle">소재 요소 상세 분석</h5>
                </div>
            </div>

            <div class="row">
                {sample_data.map((dt) => <div class="col-sm-12 col-md-6 col-lg-3 m-0 p-4 creative-chart-wrapper">
                    <div class="creative-chart-link"><a data-toggle="dialog" disabled href="#">자세히 보기&gt;</a></div>
                    <Plot style={{width: '95%', height: 300}} data={dt.labels.map((lb,idx)=>{
                        return {type: 'bar', orientation: 'h', name: lb, text: [dt.data[idx]], textposition: 'auto', y: [lb], x: [dt.data[idx]], marker: {color: bar_colors[idx]}}; 
                    })} layout={{autosize: true, showlegend: false, xaxis: {showgrid: false, showline: false, showticklabels: false}, title: dt.title}} config={{displayModeBar: false}} />
                </div>)}
            </div>
        </div>);
    }
    
    render() {
        return (<div className="container-flex panel-wrapper">
                <div className="row">
                    <Querybar />
                    <CategoryBar />
                </div>
                <div className="row">
                    <CardPanel 
                        body={this.renderContent()} />
                </div>
            </div>
        );
    }
}

export default CreativeScreen;