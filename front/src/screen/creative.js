import React from 'react';
import Querybar from '../component/querybar';
import CardPanel from '../component/cardpanel';
import CategoryBar from '../component/categorybar';
import Plot from 'react-plotly.js';
import DropBtn from '../component/dropbtn';

import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell} from 'recharts';

const bar_colors = ['#D9D9D9','#9DC3E6','#1F4E79','#20ADE3','#002060'];



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

class CreativeScreen extends React.Component {
    constructor(ps) {
        super(ps);
        this.state = {};

        //
        
    }

    renderContent() {
        return (<div class="flex-container">
            <div class="row section-title">
                <div class="col">
                    <h3 className="title">Element Analysis</h3>
                    <h5 className="subtitle">소재 요소 상세 분석</h5>
                </div>
            </div>

            <div class="row">
                {sample_data.map((dt) => <div class="col-sm-12 col-md-6 col-lg-3 m-0 p-1">
                    <div class="creative-chart-link"><a data-toggle="dialog" disabled href="#">자세히 보기&gt;</a></div>
                    <div class="creative-chart-wrapper">
                        <h5>{dt.title}</h5>
                        <ResponsiveContainer width="95%" height={180}>
                            <BarChart data={dt.labels.map((lb,idx)=>({l:lb, d:dt.data[idx]}))}
                                layout="vertical" barCategoryGap={0} >
                                <XAxis type="number" tick={false} />
                                <YAxis type="category" dataKey="l" tick={{stroke: 'transparent'}} />
                                <Tooltip />
                                <Bar dataKey="d" isAnimationActive={false} label={{position: 'end', fill: '#fff'}}>
                                    {dt.labels.map((lb,idx)=><Cell key={'cell-'+idx+'-'+lb} fill={bar_colors[idx]} />)}
                                </Bar>
                                
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
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