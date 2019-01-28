import React from 'react';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip} from 'recharts';
import AppScreen from './appScreen';
import CreativePreview from '../component/creativePreview';
import AttributeMeta from '../module/attrMeta';
import App from '../App';
import moment  from 'moment';
import Metric from '../module/metric';

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

const INDUSTRY_KEY = 'category';
const WEEK_FORMAT = 'YYYYMM';

const ScreenAccessor = 'dashboard';
 
class DashboardScreen extends AppScreen {
    static ACCESSOR = ScreenAccessor;
    // static _ACCESSOR = 'dashboard';
    static _TITLE = {ko: '업종별 분석', en: 'By industry'};

    constructor(ps) {
        super(ps, ScreenAccessor);
        if(!DashboardScreen.INSTANCE)
            DashboardScreen.INSTANCE = this;
        
        this.state.tops = {};
        this.state.timeline = [];
        this.state.tables = [];
    }

    timelineWeekFormat(d) {
        // week of the year
        // let of = Object.assign(d, {});

        let wk = d.isoWeeks();
        let wo = moment(d.format('YYYY-MM-01T00:00:00')).isoWeeks();
        if(wo<=wk)
            wk -= wo;
        return d.format('YYYY-MM '+(wk+1)+'주차');
    }

    updateRefreshingContentState(nextState) {
        // console.log(nextState);

        let metric = this.state.metric;
        if(nextState.metric) {
            // re-calculate metric
            App.data.setMetric(nextState.metric);
            metric = nextState.metric;
        }
        if(nextState.from || nextState.till) {
            // TODO: load next data
        }

        let tags = AttributeMeta.AllClasses().reduce((acc, cls)=>{  
            if(nextState[cls])
                acc.push(nextState[cls]);
            return acc;
        }, []);

        let cids = App.data.listCampaignIds(tags)
            .map((cid)=>parseInt(cid));

        let topCombi = App.data.retrieveTopCombinations(
            AttributeMeta.PredefinedClasses(),
            metric, cids, this.state.from, this.state.till);
        // console.log(topCombi);

        // nextState.tops = {};
        nextState.tops = AttributeMeta.PredefinedClasses().reduce((rs, cls)=>{
            rs[cls] = topCombi && topCombi.c ? topCombi.c[cls] : '-';
            return rs;
        }, {});
        
        nextState.timeline = App.data.retrieveTimelines(
            this.timelineWeekFormat.bind(this), 
            metric, cids,
            this.state.from, this.state.till);

        nextState.tables = App.data.retrieveCategoryScores(
            'category', AttributeMeta.PredefinedClasses(),
            metric, cids, this.state.from, this.state.till
        );

        // console.log(nextState.tables);

        return nextState;
    }

    renderElementCard(ctype, cls, title) {
        return (<div className="section col-3" key={cls+':'+title}>
            <h5 className={'section-title p-0 class-'+ctype}>{title}</h5>
            <div className="section-text">{cls}</div>
        </div>);
    }

    renderContentChart() {
        if(!this.state.timeline)
            return  '';

        let chartData = this.state.timeline.map((td)=>{
            return {xaxis: td.d, [this.state.metric]: td.avg};
        });
        let metric = Metric.ByKey(this.state.metric);


        return (<ResponsiveContainer width="100%" height={0.45*window.innerHeight}>
            <LineChart data={chartData}>
                <XAxis dataKey="xaxis" />
                <YAxis tick={false} stroke="transparent" />
                <Line dataKey={this.state.metric} 
                    stroke="#002060" strokeWidth="3" 
                    dot={{r: 5}} />
                <Tooltip formatter={metric.valueString.bind(metric)} />
            </LineChart>
        </ResponsiveContainer>);
    }

    renderClassTable(tb) {
        // console.log(tb);
        // return '';
        return (<table className="table">
            <thead>
                <tr>
                    <th>속성</th>
                    {AttributeMeta.Design.classes().map((cls)=><th className={cls}>{cls}</th>)}
                    {AttributeMeta.Message.classes().map((cls)=><th className={cls}>{cls}</th>)}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>옵션</th>
                    {AttributeMeta.Design.classes().map((cls)=>
                        <td className="class-design">{App.lang.label(tb.data.c[cls])}</td>
                    )}
                    {AttributeMeta.Message.classes().map((cls)=>
                        <td className="class-message">{App.lang.label(tb.data.c[cls])}</td>
                    )}
                </tr>
                <tr>
                    <th>{this.state.metric.toUpperCase()}</th>
                    <td className="class-design cell-value" align="center" 
                        colspan={AttributeMeta.PredefinedClasses().length}>
                        {Metric.ByKey(this.state.metric).valueString(tb.data.s.avg)}
                    </td>
                </tr>
                <tr>
                    <th>예시</th>
                    <td colspan={AttributeMeta.PredefinedClasses().length} align="center">
                        <CreativePreview />
                    </td>
                </tr>
            </tbody>
        </table>)
    }

    renderClassTableSampleImage(cls) {
        return (<img src={'/img/sample_'+cls+'.png'} alt={'Category: '+cls} />)
    }

    renderContent() {
        console.log(this.state.tops);
        return (<div className="m-0 p-1">
            <div className="row panel-header">
                <div className="col">
                    <h3 className="panel-title">Best Creative Element</h3>
                </div>
            </div>
            <div className="row dashboard-card-design">
                {AttributeMeta.Design.classes().map((cls)=>
                    this.renderElementCard('design', cls, App.lang.label(this.state.tops[cls])))}
            </div>
            <div className="row dashboard-card-message">
                {AttributeMeta.Message.classes().map((cls)=>
                    this.renderElementCard('message', cls, App.lang.label(this.state.tops[cls])))}
            </div>
            <div className="row dashboard-card-chart">
                <div className="col">
                    {this.renderContentChart()}
                </div>
            </div>
            <div className="row panel-details">
                <div className="col">
                    <h3 className="section-title p-0">Industry Analysis</h3>
                    {this.state.tables.map((tb)=>{
                        return (<div className="panel-category-detail">
                            <h5>{App.lang.label(tb.tag)}</h5>
                            {this.renderClassTable(tb)}
                        </div>);
                    })}
                </div>
            </div>
        </div>);
    }

    // ignore category controls
    renderQueryBottomControls() { return '' }
}

export default DashboardScreen;