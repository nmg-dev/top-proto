import React from 'react';

import AttributeMeta from '../module/ameta';

import Querybar from '../component/querybar';
import MetricBtn from '../component/metricbtn';
import PeriodBtn from '../component/periodbtn';
import CategoryBtn from '../component/categorybtn';
import DropBtn from '../component/dropbtn';
import CardPanel from '../component/cardpanel';

const queryDrops = [
    {title: '업종', cls: 'category'},
    {title: '채널', cls: 'channel'},
    {title: '미디어', cls: 'media'},
    {title: '광고목적', cls: 'goal'},
]


class AppScreen extends React.Component {
    static views = {};

    constructor(ps) {
        super(ps);
    }

    renderQueryTopControls() {
        return [<MetricBtn />, <PeriodBtn />];
    }

    renderQueryMidControls() {
        return queryDrops.map((q) => <DropBtn title={q.title}
            placeholder={q.title + ' 선택'}
            icon={<img className="query-dropdown" src={'/img/icon-'+q.cls+'.png'} />}
            options={[]} />);
    }

    renderQueryBottomControls() {
        return (<div className="categorybar">
            {this._queryBottomControlWrap('Message Type', AttributeMeta.Message)}
            {this._queryBottomControlWrap('Design Type', AttributeMeta.Design)}
        </div>)
    }

    _queryBottomControlWrap(title, attrMeta) {
        let tc = 'class-' + title.toLowerCase();
        return (<div className="categorybar-wrapper">
            <h3 className={'wrapper-title m-0 p-0 ' + tc} >{title}</h3>
            <div className="categorybar-subwrapper">
                {attrMeta.classes().map((cls)=>(<div className="categorybar-control-wrapper">
                    <h5 className={'control-title '+tc}>{cls}</h5>
                    <div className="button-group category-control">
                        <CategoryBtn placeholder="ALL" options={[]} />
                    </div>
                </div>))}
            </div>
        </div>);
    }


    // abstract
    renderContent() { return ''; }

    render() {
        return (
            <div className="container-fluid panel-wrapper m-0 p-4">
                <div className="row m-0 p-0">
                    <div className="col m-0 p-0">
                        <Querybar 
                            tops={this.renderQueryTopControls()} 
                            mids={this.renderQueryMidControls()} 
                            bottoms={this.renderQueryBottomControls()} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <CardPanel body={this.renderContent()} />
                    </div>
                </div>
            </div>
        );
    }
}

export default AppScreen;