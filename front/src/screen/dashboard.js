import React from 'react';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts';
import AppScreen from './appScreen';
import CreativePreview from '../component/creativePreview';
import AttributeMeta from '../module/attrMeta';
import App from '../App';
import Metric from '../module/metric';

import './dashboard.css';
import ModFormat from '../module/format';

// const INDUSTRY_KEY = 'category';
// const WEEK_FORMAT = 'YYYYMM';

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

        
    }

    updateRefreshingContentState(nextState) {
        const _data = this._app.data;

        let metric = this.state.metric;
        if(nextState.metric) {
            // re-calculate metric
            _data.setMetric(nextState.metric);
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

        let cids = _data.listCampaignIds(tags)
            .map((cid)=>parseInt(cid));

        let topCombi = _data.retrieveTopCombinations(
            AttributeMeta.PredefinedClasses(),
            metric, cids, this.state.from, this.state.till);

        nextState.tops = AttributeMeta.PredefinedClasses().reduce((rs, cls)=>{
            rs[cls] = topCombi && topCombi.c ? topCombi.c[cls] : '-';
            return rs;
        }, {});
        
        nextState.timeline = _data.retrieveTimelines(
            ModFormat.autoPeriodFormat(this.state.period, 15), 
            metric, cids,
            this.state.from, this.state.till);

        nextState.tables = _data.retrieveCategoryScores(
            'category', AttributeMeta.PredefinedClasses(),
            metric, cids, this.state.from, this.state.till
        );

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
                <XAxis dataKey="xaxis" tickLine={false} tickCount={12} interval="preserveStartEnd" />
                <YAxis axisLine={false} tick={false} tickCount={4} width={0} />
                <CartesianGrid horizontal={true} vertical={false} strokeDasharray="1 1" />
                <Line dataKey={this.state.metric} 
                    stroke="#002060" strokeWidth="3" 
                    dot={{r: 5}} />
                <Tooltip formatter={metric.valueString.bind(metric)} />
            </LineChart>
        </ResponsiveContainer>);
    }

    renderClassTable(tb) {
        const _lang = App.lang;
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
                        <td className="class-design">{_lang.label(tb.data.c[cls])}</td>
                    )}
                    {AttributeMeta.Message.classes().map((cls)=>
                        <td className="class-message">{_lang.label(tb.data.c[cls])}</td>
                    )}
                </tr>
                <tr>
                    <th>{this.state.metric.toUpperCase()}</th>
                    <td className="class-design cell-value" align="center" 
                        colSpan={AttributeMeta.PredefinedClasses().length}>
                        {Metric.ByKey(this.state.metric).valueString(tb.data.s.avg)}
                    </td>
                </tr>
                <tr>
                    <th>예시</th>
                    <td colSpan={AttributeMeta.PredefinedClasses().length} align="center">
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
        const _lang = App.lang;

        return (<div className="m-0 p-1">
            <div className="row panel-header">
                <div className="col">
                    <h3 className="panel-title">Best Creative Element</h3>
                </div>
            </div>
            <div className="row dashboard-card-design">
                {AttributeMeta.Design.classes().map((cls)=>
                    this.renderElementCard('design', cls, _lang.label(this.state.tops[cls])))}
            </div>
            <div className="row dashboard-card-message">
                {AttributeMeta.Message.classes().map((cls)=>
                    this.renderElementCard('message', cls, _lang.label(this.state.tops[cls])))}
            </div>
            <div className="row dashboard-card-chart">
                <div className="col">
                    {this.renderContentChart()}
                </div>
            </div>
            <div className="row dashboard-card-table panel-details">
                <div className="col">
                    <h3 className="section-title">Element Analysis</h3>
                    {this.state.tables.map((tb)=>{
                        return (<div className="panel-category-detail">
                            <h5>{_lang.label(tb.tag)}</h5>
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