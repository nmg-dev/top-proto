import React from 'react';

import AttributeMeta from '../module/attrMeta';

import Querybar from '../component/querybar';
import MetricBtn from '../component/metricbtn';
import PeriodBtn from '../component/periodbtn';
import CategoryBtn from '../component/categorybtn';
import DropBtn from '../component/dropbtn';
import CardPanel from '../component/cardpanel';
import App from '../App';


const QueryDropLabels = {
    category: '업종',
    channel: '채널',
    media: '미디어',
    goal: '광고목적',
};


class AppScreen extends React.Component {
    static views = {};

    constructor(ps) {
        super(ps);

        this.state = {
            metric: this.props.metric,
            from: this.props.period.from,
            till: this.props.period.till,
            tags: [],
        }
        //
        this.state = this.updateRefreshingContentState(this.state);
    }

    updateRefreshingContentState(nextState) { return nextState; }
    refreshContent(nextState) {
        this.setState(
            this.updateRefreshingContentState(Object.assign(this.state, nextState)), 
            ()=>console.log(this.state));
    }

    renderQueryTopControls() {
        return [
            <MetricBtn kpi={this.state.metric} 
                onChange={(m)=>this.refreshContent({metric: m})} />, 
            <PeriodBtn from={this.state.from} till={this.state.till}
                onChange={(p)=>this.refreshContent(p)} />];
    }

    renderQueryMidControls() {
        // console.log(AttributeMeta.Config.classes());
        return AttributeMeta.Config.classes().map((cls) => (
            <DropBtn title={QueryDropLabels[cls]}
                placeholder={QueryDropLabels[cls] + ' 선택'}
                icon={<img className="query-dropdown" src={'/img/icon-'+cls+'.png'} />}
                options={App.data.listTagOptions(cls)} 
                onChange={this._onTagListUpdated.bind(this)}
                />
        ));
    }

    renderQueryBottomControls() {
        return (<div className="categorybar">
            {this._queryBottomControlWrap('Design Type', AttributeMeta.Design)}
            {this._queryBottomControlWrap('Message Type', AttributeMeta.Message)}
        </div>)
    }

    _onTagListUpdated(ts) {
        let siblings = ts.reduce((acc,tid)=>{
            acc = acc.concat(App.data.listSiblingTags(tid));
            return acc;
        }, []);
        let tags = this.state.tags.filter((tid)=>siblings.indexOf(tid)<0);
        // one at a category
        tags = tags.concat(ts);
        console.log(tags, siblings, this.state.tags);
        this.refreshContent({tags: tags});
    }

    _queryBottomControlWrap(title, attrMeta) {
        let tc = 'class-' + title.toLowerCase();
        return (<div className="categorybar-wrapper">
            <h3 className={'wrapper-title m-1 p-1 ' + tc} >{title}</h3>
            <div className="categorybar-subwrapper">
                {attrMeta.classes().map((cls)=>(<div className="categorybar-control-wrapper">
                    <h5 className={'control-title m-1 p-1 '+tc}>{cls}</h5>
                    <div className="button-group category-control m-0 p-0">
                        <CategoryBtn placeholder="ALL" options={App.data.listTagOptions(cls)}
                            onChange={this._onTagListUpdated.bind(this)}
                        />
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