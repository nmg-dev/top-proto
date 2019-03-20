import React from 'react';

import AttributeMeta from '../module/attrMeta';
import GTM from '../module/gtm';

import App from '../App';

import MetricBtn from '../component/metricbtn';
import PeriodBtn from '../component/periodbtn';
import CategoryBtn from '../component/categorybtn';
import DropBtn from '../component/dropbtn';
import CardPanel from '../component/cardpanel';

import './appScreen.css';


const LOGIN_SCREEN = 'login';
const DASHBOARD_SCREEN = 'dashboard';
const CREATIVE_SCREEN = 'creative';
const SIMULATION_SCREEN = 'simulation';

const MANAGE_DATA = 'manage-data';
const MANAGE_TAGS = 'manage-tag';
const MANAGE_CMPS = 'manage-campaign';
const MANAGE_USER = 'admin-user';


const QueryDropLabels = {
    category: '업종',
    device: '장치',
    media: '미디어',
    adtype: '광고유형',
};


class AppScreen extends React.Component {
    static views = {};
    static ViewKeys = [
        DASHBOARD_SCREEN,
        CREATIVE_SCREEN,
        SIMULATION_SCREEN,
    ];

    static ViewTitles = {
        ko: {
            [DASHBOARD_SCREEN]: '업종별 분석',
            [CREATIVE_SCREEN]: '크리에이티브 분석',
            [SIMULATION_SCREEN]: '예상효율 확인',

            [MANAGE_DATA]: '데이터 입력',
            [MANAGE_TAGS]: '태그 관리',
            [MANAGE_CMPS]: '캠페인 관리',
            [MANAGE_USER]: '사용자 관리',
        },
        en: {
            [DASHBOARD_SCREEN]: 'by Industries',
            [CREATIVE_SCREEN]: 'by Creatives',
            [SIMULATION_SCREEN]: 'Simulation',

            [MANAGE_DATA]: 'Push Data',
            [MANAGE_TAGS]: 'Manage Tags',
            [MANAGE_CMPS]: 'Manage Campaigns',
            [MANAGE_USER]: 'Manage Users',
        }
    };

    static ViewRenders = {};
    static indexViewAccessor() {
        return DASHBOARD_SCREEN;
    }

    static ViewTitleOf(vk) {
        let locale='ko';
        return AppScreen.ViewTitles[locale][vk];
    }

    

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
            // rs = Object.assign(rs, {[key]: val});
            rs[key] = val;
            return rs;
        }, {});

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
        return (<div className="d-flex">
            {this._queryBottomControlWrap('Design Type', AttributeMeta.Design)}
            {this._queryBottomControlWrap('Message Type', AttributeMeta.Message)}
        </div>)
    }

    _queryBottomControlWrap(title, attrMeta) {
        let tc = 'class-' + title.toLowerCase();
        return (<div className="categorybar-wrapper">
            <h3 className={'wrapper-title ' + tc} >{title}</h3>
            <div className="categorybar-subwrapper">
                {attrMeta.classes().map((cls)=>{
                    this._refs[cls] = React.createRef();
                    return (<div className="categorybar-control-wrapper">
                        <h5 className={'control-title '+tc}>{cls}</h5>
                        <div className="button-group category-control">
                            <CategoryBtn ref={this._refs[cls]}
                                className="query-control m-0"
                                placeholder="ALL" options={App.data.listTagOptions(cls)}
                                onChange={this.refreshContent.bind(this)}
                            />
                        </div>
                    </div>);
                })}
            </div>
        </div>);
    }

    renderQuerybar() {
        return (
            <div className="querybar">
                <div className="querybar-top">
                    <div className="querybar-title d-flex justify-content-start align-items-center">
                        <h1>Tag Operation</h1>
                        <sup>Beta</sup>
                    </div>
                    <div className="querybar-controls">
                        {this.renderQueryTopControls()}
                    </div>
                </div>
                <div className="querybar-mid">
                    <div className="querybar-controls">
                        {this.renderQueryMidControls()}
                    </div>
                </div>
                <div className="querybar-bottom">
                    <div className="querybar-controls">
                        {this.renderQueryBottomControls()}
                    </div>
                </div>
            </div>
        );
    }


    // abstract
    renderContent() { return ''; }

    renderSubsides() { return ''; }

    render() {
        return (
            <div className="container-fluid panel-wrapper m-0 p-4">
                <div className="row m-0 p-0">
                    <div className="col m-0 p-0">
                        {this.renderQuerybar()}
                    </div>
                </div>
                <div className="row">
                    <div className="col col-12">
                        <CardPanel body={this.renderContent()} />
                    </div>
                </div>
                <div className="row footer m-0 p-0">
                        <a href="https://www.nextmediagroup.co.kr" target="_blank">Next Media Group</a> &nbsp;is part of the&nbsp; <a href="https://fsn.co.kr" target="_blank">FSN group</a>
                </div>
                {this.renderSubsides()}
            </div>

        );
    }
}

export default AppScreen;