import React from 'react';

import AttributeMeta from '../module/attrMeta';

import Querybar from '../component/querybar';
import MetricBtn from '../component/metricbtn';
import PeriodBtn from '../component/periodbtn';
import CategoryBtn from '../component/categorybtn';
import DropBtn from '../component/dropbtn';
import CardPanel from '../component/cardpanel';
import App from '../App';
import GTM from '../module/gtm';


const QueryDropLabels = {
    category: '업종',
    channel: '채널',
    media: '미디어',
    goal: '광고목적',
};


class AppScreen extends React.Component {
    static views = {};

    constructor(ps, accessor) {
        super(ps);

        this._app = App;
        this._accessor = accessor;

        this.state = {
            metric: this.props.metric,
            period: this.props.period,
        };
        this._refs = {};
    }

    componentDidMount() {
        this.refreshContent();
        GTM.ScreenView(this._accessor);
    }

    updateRefreshingContentState(nextState) { return nextState; }
    _metricRecalculateRequired(nextState) {
        return (nextState.metric && this.state.metric != nextState.metric);
    }
    _periodReloadRequired(nextState) {
        return (nextState.period && 
            ( (nextState.period.from && nextState.period.from.isBefore(this.state.from))
            ||(nextState.period.till && nextState.period.till.isBefore(this.state.till)) )
        );
    }
    refreshContent() {
        // retrieve values
        let nextState = Object.keys(this._refs).reduce((rs, key)=> {
            let ctrl = this._refs[key].current;
            let val = ctrl.getSelected();
            rs = Object.assign(rs, {[key]: val});
            return rs;
        }, {});
        // console.log(nextState);

        // on metric change
        if(this._metricRecalculateRequired(nextState))
            App.data.setMetric(nextState.metric);
        
        // on period change
        if(this._periodReloadRequired(nextState)) {
            // TODO: api reload
        }

        GTM.RefreshScreen(this._accessor, nextState);
        this.setState(this.updateRefreshingContentState(nextState));
    }

    renderQueryTopControls() {
        this._refs = Object.assign(this._refs, { 
            metric: React.createRef(),
            period: React.createRef() });
        return [
            <MetricBtn kpi={this.state.metric} ref={this._refs.metric}
                onChange={this.refreshContent.bind(this)} />, 
            <PeriodBtn from={this.state.period.from} till={this.state.period.till} ref={this._refs.period}
                onChange={this.refreshContent.bind(this)} />];
    }

    renderQueryMidControls() {
        return AttributeMeta.Config.classes().map((cls) => {
            this._refs[cls] = React.createRef();
            return (<DropBtn title={QueryDropLabels[cls]} ref={this._refs[cls]}
                placeholder={QueryDropLabels[cls] + ' 선택'}
                icon={<img className="query-dropdown" src={'/img/icon-'+cls+'.png'} />}
                options={App.data.listTagOptions(cls)} 
                onChange={this.refreshContent.bind(this)} />);
        });
        
    }

    renderQueryBottomControls() {
        return (<div className="categorybar">
            {this._queryBottomControlWrap('Design Type', AttributeMeta.Design)}
            {this._queryBottomControlWrap('Message Type', AttributeMeta.Message)}
        </div>)
    }

    _queryBottomControlWrap(title, attrMeta) {
        let tc = 'class-' + title.toLowerCase();
        return (<div className="categorybar-wrapper">
            <h3 className={'wrapper-title m-1 p-1 ' + tc} >{title}</h3>
            <div className="categorybar-subwrapper">
                {attrMeta.classes().map((cls)=>{
                    this._refs[cls] = React.createRef();
                    return (<div className="categorybar-control-wrapper">
                        <h5 className={'control-title m-1 p-1 '+tc}>{cls}</h5>
                        <div className="button-group category-control m-0 p-0">
                            <CategoryBtn ref={this._refs[cls]}
                                placeholder="ALL" options={App.data.listTagOptions(cls)}
                                onChange={this.refreshContent.bind(this)}
                            />
                        </div>
                    </div>);
                })}
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