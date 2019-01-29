import React from 'react';
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList} from 'recharts';
import AppScreen from './appScreen';

import CreativeDialog from '../component/creativeDialog';
import CreativePreview from '../component/creativePreview';
import AttributeMeta from '../module/attrMeta';
import Metric from '../module/metric';

import './creative.css';

const bar_colors = ['#D9D9D9','#9DC3E6','#1F4E79','#20ADE3','#002060'];

const ScreenAccessor = 'creative';

class CreativeScreen extends AppScreen {
    static ACCESSOR = ScreenAccessor;

    constructor(ps) {
        super(ps, ScreenAccessor);
        // this.state = {};   
        this._dialog = React.createRef();
        this.state.tops = [];
        this.state.scores = [];
    }

    updateRefreshingContentState(nextState) {
        let _data = this._app.data;
        // console.log(nextState);
        let config_filters = AttributeMeta.Config.classes()
            .filter((cls)=>nextState[cls])
            .map((cls)=>nextState[cls]);
        let campaign_ids = _data.listCampaignIds(config_filters).map((cid)=>parseInt(cid));
        let metric = nextState.metric ? nextState.metric : this.state.metric;

        let tops = _data.retrieveTopCombinations(
            AttributeMeta.PredefinedClasses(),
            metric, campaign_ids, this.state.from, this.state.till, 3
        );
        let option_tag_clss = _data.listTagClasses(campaign_ids);
        let tag_clss = AttributeMeta.PredefinedClasses().concat(Object.keys(option_tag_clss));
        let scores = tag_clss.reduce((rss, cls)=> {
            rss[cls] =_data.retrieveClassScores(cls, metric, campaign_ids, this.state.period.from, this.state.period.till); 
            return rss;
        }, {});

        console.log({
            tops: tops,
            scores: scores,
        });
        return Object.assign(nextState,  {
            tops: tops,
            scores: scores,
        });
    }

    showDetailDialog(ev) {
        let dk = ev.target.getAttribute('dataKey');
        if(this._dialog && this._dialog.current) {
            this._dialog.current.setState({
                cls: dk,
                options: [],
                // kpi: this.context.kpi,
                _data: [],
                data: [],
                _from: '',
                _till: '',
                period_from: '',
                period_till: '',
            }, ()=>this._dialog.current.show());
        }
    }

    renderContentChart(cls) {
        const _lang = this._app.lang;
        let metric = Metric.ByKey(this.state.metric);
        if(this.state.scores[cls]) {
            let chartData = this.state.scores[cls].map((dt)=>{
                return {
                    label: _lang.label(dt),
                    value: dt.scores.avg,
                };
            });
            return (<div class="creative-chart-wrapper">
                <h5>{_lang.label(cls)}</h5>
                <ResponsiveContainer width="95%" height={.2*window.innerHeight}>
                    <BarChart data={chartData} layout="vertical" barCategoryGap={0} >
                        <XAxis type="number" tick={false} />
                        <YAxis type="category" dataKey="label" tick={{stroke: 'transparent'}} />
                        <Tooltip formatter={metric.valueString.bind(metric)} />
                        <Bar dataKey="value" isAnimationActive={false} 
                            label={false}>
                            <LabelList dataKey="value" position="insideRight" 
                                fill="#fff"
                                formatter={metric.valueString.bind(metric)} />
                            {this.state.scores[cls].map((dt,idx)=>
                                <Cell key={'cell-'+idx+'-'+dt.name} fill={bar_colors[idx]} />
                            )}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>);
        } else {
            return '';
        }
        
    }

    renderContent() {
        return (<div class="section panel-details">
            <div class="row section-title p-0">
                <div class="col p-0">
                    <h3>Element Analysis</h3>
                    <h5>소재 요소 상세 분석</h5>
                </div>
            </div>
            <div class="row creative-previews">
                {this.state.tops.map((top, rank)=>(
                    <div class="col-sm-12 col-md-4">
                        <h5>{rank+1} 순위 조합</h5>
                        <CreativePreview top={top} />
                    </div>
                ))}
            </div>

            <div class="row panel-charts">
                {AttributeMeta.PredefinedClasses().map((cls) => <div class="col-sm-12 col-md-6 col-lg-3 m-0 p-1 ">
                    <div class="creative-chart-link">
                        <a dataKey={cls}
                            onClick={this.showDetailDialog.bind(this)}>자세히 보기&gt;</a>
                    </div>
                    {this.renderContentChart(cls)}
                </div>)}
            </div>
            <CreativeDialog ref={this._dialog} />
        </div>);
    }
}

export default CreativeScreen;