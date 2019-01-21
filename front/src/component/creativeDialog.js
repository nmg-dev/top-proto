import React from 'react';
import Dialog from './dialog';

import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip} from 'recharts'
import CategoryBtn from './categorybtn';
import PeriodBtn from './periodbtn';
import Metric from '../module/metric';

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


class CreativeDialog extends Dialog {
    constructor(ps) {
        super(ps);
        this.state = {
            cls: '',
            options: '',
            kpi: '',
            _from: '',
            _till: '',
            _data: [],
            data: [],
            period_from: '',
            period_till: '',
        }
    }

    renderModalHeader() {
        return (<div className="modal-header">
            <div className="d-block">
                <h3 className="modal-title">{this.state.cls} Details</h3>
                <h5 className="modal-subtitle">요소 상세 분석</h5>
            </div>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>);
    }

    onClickMetricTableColumn(ev) {
        this.setState({kpi: ev.target.getAttribute('metric')});
    }

    renderModalBody() {
        let range = [];
        range[29] = 0;
        range.fill(0, 0);
        return (<div className="modal-body">
            <div className="d-flex justify-content-end align-items-baseline">
                <CategoryBtn placeholder="All" options={[]} className="btn" />
                <PeriodBtn />
            </div>
            <div>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={sample_data}>
                        <Line dataKey="y" stroke="#002060" strokeWidth="3" dot={{r:5}} />
                        <Tooltip />
                        <XAxis dataKey="t" />
                        <YAxis hide={true} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div>
                <table class="table creative-modal">
                    <thead>
                        <tr>
                            <th>날짜</th>
                            {Metric.List().map((m)=>(<th metric={m.key()}
                                className={this.state.kpi===m.key()?'kpi-column':''}
                                onClick={this.onClickMetricTableColumn.bind(this)}>
                                    {m.label()}
                                </th>))}
                        </tr>
                    </thead>
                    <tbody class="creative-modal-result">
                        {range.map(()=><tr>
                            <td>2019-01-01</td>
                            {Metric.List().map((m)=><td className={this.state.kpi===m.key()?'kpi-column':''}>
                                {m.format(Math.random())}
                            </td>)}
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>)
    }


}

export default CreativeDialog;