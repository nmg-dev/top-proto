import React from 'react';
import Querybar from '../component/querybar';
import CardPanel from '../component/cardpanel';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip} from 'recharts';

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
    { t: '2018년 10월 1주차',	y: 500},
    { t: '2018년 10월 2주차',	y: 426},
    { t: '2018년 10월 3주차',	y: 602},
    { t: '2018년 10월 4주차',	y: 737},
    { t: '2018년 11월 1주차',	y: 725},
    { t: '2018년 11월 2주차',	y: 616},
    { t: '2018년 11월 3주차',	y: 598},
    { t: '2018년 11월 4주차',	y: 767},
    { t: '2018년 12월 1주차',	y: 869},
    { t: '2018년 12월 2주차', y: 664},
    { t: '2018년 12월 3주차', y: 693},
    { t: '2018년 12월 4주차', y: 745},
];

const table_columns = [
    'Layout', 'Background', 'Objet', 'Button', 'Keytopic', 'Keyword', 'Trigger', 'Ad Copy', 
];
const table_values = {
    fnb: [
        {l: '중앙배치형', v: 200},
        {l: '무색', v: 451},
        {l: '일러스트', v: 115},
        {l: '타임형', v: 447},
        {l: '모바일 프로모션', v: 200},
        {l: '할인율 표기', v: 451},
        {l: '마감 임박', v: 115},
        {l: '주목형', v: 447},
    ],
    houseware: [
        {l: '우측배치형', v: 200},
        {l: '면분할', v: 451},
        {l: '모델', v: 115},
        {l: '혜택형', v: 447},
        {l: '세일강조', v: 200},
        {l: '할인율 표기', v: 451},
        {l: '경품 증정 강조', v: 115},
        {l: '주목형', v: 447},
    ],
};

const table_titles = {
    fnb: '식음료', houseware: '가정용품',
}
 
class DashboardScreen extends React.Component {
    constructor(ps) {
        super(ps);
        this.state = {};
    }

    renderElementCard(cls, title) {
        return (<div class="section col-3" key={cls+':'+title}>
            <h5 class="section-title">{cls}</h5>
            <div class="section-text">{title}</div>
        </div>);
    }

    renderContentChart() {
        return (<ResponsiveContainer width="95%" height={280}>
        <LineChart data={sample_data}>
            <XAxis dataKey="t" 
                />
            <YAxis stroke="transparent" />
            <Line dataKey="y" 
                stroke="#002060" strokeWidth="3" 
                dot={{r: 5}} />
            <Tooltip />
        </LineChart></ResponsiveContainer>);
    }

    renderClassTable(cls) {
        return (<table class="table">
            <thead>
                <tr>
                    <th>속성</th>
                    {table_columns.map((c)=><th key={cls+':'+c}>{c}</th>)}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>옵션</th>
                    {table_values[cls].map((v)=><td key={cls+':v:'+v.l}>{v.l}</td>)}
                </tr>
                <tr>
                    <th>CPC</th>
                    {table_values[cls].map((v)=><td key={cls+':v:'+v.v}>{v.v}</td>)}
                </tr>
                <tr>
                    <th>예시</th>
                    <td colspan={table_values[cls].length} align="center">
                        {this.renderClassTableSampleImage(cls)}
                    </td>
                </tr>
            </tbody>
        </table>)
    }

    renderClassTableSampleImage(cls) {
        return (<img src={'/img/sample_'+cls+'.png'} alt={'Category: '+cls} />)
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
                    {this.renderContentChart()}
                </div>
            </div>
            <div class="row panel-details">
                <div class="col">
                    <h3>Industry Analysis</h3>
                    {['fnb','houseware'].map((cls)=>{
                        return (<div class="panel-category-detail">
                            <h5>{table_titles[cls]}</h5>
                            {this.renderClassTable(cls)}
                        </div>);
                    })}
                </div>
            </div>
        </div>);
    }

    render() {
        return (<div className="container-flex panel-wrapper">
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