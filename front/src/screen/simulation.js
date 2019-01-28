import React from 'react';
import CategoryBtn from '../component/categorybtn';
import AppScreen from './appScreen';
import ApplicationContext from '../AppContext';
import Metric from '../module/metric';
import AttributeMeta from '../module/attrMeta';
import App from '../App';

const table_options = {
    design: [
        {name: 'layout', label: 'Layout', values: [{t: 'left', d: '좌측'}, {t: 'right', d: '우측'}, {t: 'center', d: '중앙'}, {t: 'between', d: '좌우'}]},
        {name: 'objet', label: 'Object', values: [{t: 'picture', d: '실사'}, {t: 'illust', d: '일러스트'}, {t: 'model', d: '모델'}]},
        {name: 'background', label: 'Background', values: [{t: 'blank', d: '무색'}, {t: 'solid.light', d: '밝은 단색'}, {t: 'solid.dark', d: '어두운 단색'}, {t: 'split', d: '면분할'}, {t: 'image', d: '이미지'}]},
        {name: 'button', label: 'Button', values: [{t: 'time', d: '타임형'}, {t: 'benefit', d: '혜택형'}, {t: 'suggest', d: '유도형'}]},
    ],
    adcopy: [
        {name: 'keytopic', label: 'Key Topic', values: [{t: 'promotion.mobile', d: '모바일 프로모션'}]},
        {name: 'keyword', label: 'Keyword', values: [{t: 'discount.rate', d: '할인율 표기'}]},
        {name: 'trigger', label: 'Trigger', values: [{t: 'urgency', d: '마감 임박'}]},
        {name: 'adcopy', label: 'Ad Copy', values: [{t: 'focus', d: '주목형'}]},
    ],
    optional: [
        {name: 'category', label: '업종', values: [{t: 'fnb', d: '식음료'}]},
        {name: 'channel', label: '채널', values: [{t: 'pc', d: 'PC'}]},
        {name: 'admedia', label: '미디어', values: [{t: 'naver', d: '네이버'}]},
        {name: 'goal', label: '광고목적', values: [{t: 'purchase', d: '구매'}]},
    ],
}

const ScreenAccessor = 'simulation';

class SimulationScreen extends AppScreen {
    static contextType = ApplicationContext;
    static ACCESSOR = ScreenAccessor;

    constructor(ps) {
        super(ps, ScreenAccessor);
        this.state = {
            history: [],
            options: {},
        };
    }
    appendHistory() {
        // retrive options
        let rs = {
            opts: {},
            vals: {},
        };
        // 
        Object.values(this._refs)
            .map((rf)=>rf.current)
            .forEach((el)=> {
                if(el) {
                    let ok = el.props.name;
                    let ov = el.displayText();
                    // console.log(ok, ov);
                    rs.opts[ok] = ov;
                }
            });
        Metric.Keys().forEach((mk)=>{
            rs.vals[mk] = Math.random();
        });

        let hist = this.state.history;
        hist.push(rs);
        this.setState({
            history: hist
        });
    }

    resetOptions() {
        Object.values(this._refs)
            .map((rf)=>rf.current)
            .forEach((el)=> {
                if(el) el.setState({values: []});
            });
    }

    renderOptionTable(options, clsLabel, styles) {
        return (<table className="table simulate-table" style={styles}>
            <thead>
                <tr>
                    <th>{clsLabel}</th>
                    <th>옵션</th>
                </tr>
            </thead>
            <tbody>
                {options.map((opt)=> {
                    if(!this._refs[opt.name])
                        this._refs[opt.name] = React.createRef();
                    return (<tr>
                        <th>{opt.label}</th>
                        <td>
                            <CategoryBtn key={'result-opt-'+opt.name} name={opt.name}
                                ref={this._refs[opt.name]} 
                                placeholder="ALL" 
                                options={App.data.listTagOptions(opt.name)} />
                        </td>
                    </tr>);
                })}
            </tbody>
        </table>);
    }

    renderResultSection(rs) {
        return(<div class="row section-result">
            <div class="col">
                <div>
                    <span class="simulate-option">
                    {AttributeMeta.AllClasses()
                        // .filter((opt)=>rs.opts[opt]!=='ALL')
                        .map((opt)=>rs.opts[opt])
                        .join('•')}
                    </span>
                </div>
                <table class="table simulate-result-table">
                    <thead>
                        <tr>{Metric.List().map((m)=><th>{m.label()}</th>)}</tr>
                    </thead>
                    <tbody>
                        <tr>{Metric.List().map((m)=><td>{m.format(rs.vals[m.key()])}</td>)}</tr>
                    </tbody>
                </table>
            </div>
        </div>);
    }

    renderContent() {
        return (<div class="section panel-details m-0 p-0">
            <div class="row section-title m-0 p-0">
                <div class="col m-0 p-0">
                    <h3 className="title">Creative Simulation</h3>
                    <h5 className="subtitle">소재요소별 효율 시뮬레이션</h5>
                </div>
            </div>
            <div class="row section-content">
                <div class="col-sm-12 col-lg-4">
                    {this.renderOptionTable(table_options.design, '디자인 속성', {backgroundColor: 'var(--bg-light)'})}
                </div>
                <div class="col-sm-12 col-lg-4">
                    {this.renderOptionTable(table_options.adcopy, '콘텐츠 속성')}
                </div>
                <div class="col-sm-12 col-lg-4">
                    {this.renderOptionTable(table_options.optional, '캠페인 조건')}
                </div>
            </div>
            <div class="row section-controls">
                <div class="col" align="right">
                    <button class="btn btn-default m-1 p-2">리셋</button>
                    <button class="btn m-1 p-2" onClick={this.appendHistory.bind(this)}>예상효율 확인하기</button>
                    {/* <button class="btn shadow" onClick={()=>window.print()}>출력하기</button> */}
                </div>
            </div>

            <div class="printable">
            <h3>Results</h3>
                {this.state.history.reverse().map((rs)=>this.renderResultSection(rs))}
            </div>
        </div>);
    }

    renderQueryTopControls() { return '' }
    renderQueryMidControls() { return '' }
    renderQueryBottomControls() { return '' }
}

export default SimulationScreen;