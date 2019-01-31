import React from 'react';
import Dialog from './dialog';

import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip} from 'recharts'
import CategoryBtn from './categorybtn';
import PeriodBtn from './periodbtn';
import Metric from '../module/metric';
import App from '../App';

import './creativeDialog.css';
import ModFormat from '../module/format';

class CreativeDialog extends Dialog {
    constructor(ps) {
        super(ps);
        this.state = Object.assign(this.state, {
            cls: '',
            options: [],
            kpi: '',
            _period: {from: null, till: null},
            period: {from: null, till: null},
            tag: null,
            timelines: {},
            _cids: App.data.listCampaignIds(),
        });

        this._refs = {
            category: React.createRef(),
            period: React.createRef(),
        }
    }

    prepareTimeline(cls, period, campaign_ids) {
        if(!campaign_ids)
            campaign_ids = this.state._cids;
        campaign_ids = (this.state.tag ? this.state.tag._c : App.data.listTagClassCampaignIds(cls))
            .filter((cid)=>0<=campaign_ids.indexOf(cid));

        let mcs = Metric.List();
        let timelines = mcs.reduce((rs, m)=>{
            let mk = m.key();
            let mtd = App.data.retrieveTimelines(
                ModFormat.autoPeriodFormat(period, 40), 
                mk, campaign_ids, period.from, period.till);
            mtd.forEach((mt)=>{
                let dk = mt.d.toString();
                if(!rs[dk]) rs[dk] = {d: dk};
                rs[dk][mk] = mt.avg;
            });
            return rs;
        }, {});
        return timelines;
    }


    setDataOpen(cls, kpi, period, campaign_ids) {
        if(!campaign_ids)
            campaign_ids = this.state._cids;

        this.setState({
            cls: cls,
            options: App.data.listTagOptions(cls),
            kpi: kpi,
            _period: period,
            period: period,
            tag: null, 
            _cids: campaign_ids,
            timelines: this.prepareTimeline(cls, period, campaign_ids),
        }, this.show.bind(this));
    }

    setDataValues(tag, kpi, period) {
        this.setState({
            kpi: kpi,
            period: period,
            tag: tag,
            timelines: this.prepareTimeline(this.state.cls, period)
        });
    }

    componentDidUpdate() {
        console.log('dialog updated', this.state);
    }

    renderModalHeader() {
        return (<div className="modal-header p-0">
            <div className="d-block">
                <h3 className="modal-title">{this.state.cls} Details</h3>
                <h5 className="modal-subtitle">크리에이티브 요소 상세 분석</h5>
            </div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>);
    }

    onClickMetricTableColumn(ev) {
        this.setState({kpi: ev.target.getAttribute('metric')});
    }

    onClickCategoryTableColumn(values) {
        this.setDataValues(
            App.data.getTag(values[0]), 
            this.state.kpi, 
            this.state.period);
    }

    onPeriodChanged(period) {
        this.setDataValues(
            this.state.tag, 
            this.state.kpi, 
            period);
    }

    period_format_day(m) {
        return m.format('YYYY-MM-DD');
    }

    renderModalBody() {
        let mcs = Metric.List();
        let duration = Object.keys(this.state.timelines);
        duration.sort();
        // console.log(this.state.timelines);
        let chartline = duration.map((d)=>{
            return {
                d: d,
                [this.state.kpi]: this.state.timelines[d][this.state.kpi]
            };
        });
        return (<div className="modal-body creative-modal p-0">
            <div className="d-flex justify-content-end align-items-top">
                <CategoryBtn placeholder="All" 
                    options={this.state.options} 
                    className="btn"
                    onChange={this.onClickCategoryTableColumn.bind(this)}
                 />
                <PeriodBtn 
                    from={App.period.from} 
                    till={App.period.till}
                    onChange={this.onPeriodChanged.bind(this)}
                 />
            </div>
            <div>
                <ResponsiveContainer width="100%" height={.33*window.innerHeight}>
                    <LineChart data={chartline}>
                        <Line dataKey={this.state.kpi} stroke="#002060" strokeWidth="3" />
                        <Tooltip />
                        <XAxis dataKey="d" />
                        <YAxis hide={true} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>날짜</th>
                            {mcs.map((m)=>(<th metric={m.key()}
                                className={this.state.kpi===m.key()?'kpi-column':''}
                                onClick={this.onClickMetricTableColumn.bind(this)}>
                                    {m.label()}
                                </th>))}
                        </tr>
                    </thead>
                    <tbody class="creative-modal-result">
                        {duration.map((d)=>(<tr>
                            <td>{d}</td>
                            {mcs.map((m)=>(<td className={this.state.kpi===m.key()?'kpi-column':''}>
                                {m.format(this.state.timelines[d][m.key()])}
                            </td>))}
                        </tr>))}
                    </tbody>
                </table>
            </div>
        </div>)
    }


}

export default CreativeDialog;