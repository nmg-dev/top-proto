import React from 'react';
import CategoryBtn from '../component/categorybtn';
import AppScreen from './appScreen';

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

class SimulationScreen extends AppScreen {
    static ACCESSOR = 'simulation';
    constructor(ps) {
        super(ps, SimulationScreen.ACCESSOR);
        this.state = {};
    }
    accessor() { return SimulationScreen.ACCESSOR; }
    getTitle() { return '예상효율 확인' }

    renderOptionTable(options, clsLabel, styles) {
        return (<table className="table categorytable" style={styles}>
            <thead>
                <tr>
                    <th>{clsLabel}</th>
                    <th>옵션</th>
                </tr>
            </thead>
            <tbody>
                {options.map((opt)=><tr>
                    <th>{opt.label}</th>
                    <td>
                        <CategoryBtn placeholder="ALL" options={[]} />
                    </td>
                </tr>)}
            </tbody>
        </table>);
    }

    renderContent() {
        return (<div class="flex-container" style={{height: '100%'}}>
            <div class="row section-title">
                <div class="col">
                    <h3 className="title">Creative Simulation</h3>
                    <h5 className="subtitle">소재요소별 효율 시뮬레이션</h5>
                </div>
            </div>
            <div class="row section-separator">
                <div class="col-sm-12 col-lg-4">
                    {this.renderOptionTable(table_options.design, '디자인 속성', {backgroundColor: 'var(--bg-light);'})}
                </div>
                <div class="col-sm-12 col-lg-4">
                    {this.renderOptionTable(table_options.adcopy, '콘텐츠 속성')}
                </div>
                <div class="col-sm-12 col-lg-4">
                    {this.renderOptionTable(table_options.adcopy, '캠페인 조건')}
                </div>
            </div>
            <div class="row">
                <div class="col" align="right">
                    <button class="btn btn-default shadow">리셋</button>
                    <button class="btn btn-outline-default shadow">예상효율 확인하기</button>
                </div>
            </div>
        </div>);
    }
}

export default SimulationScreen;