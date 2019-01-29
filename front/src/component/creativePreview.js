import React from 'react';
import AttributeMeta from '../module/attrMeta';

import './creativePreview.css';

const defaultRect = {x: 10, y: 0, w: 729, h: 147};
const classes = ['layout','background','objet','button', 
    'keytopic', 'keyword', 'trigger', 'adcopy',
];

const sample_values = {
    background: ['split', 'solid_dark','solid_light', 'blank'], 
    layout: ['left', 'right', 'center', 'between'],
    objet: ['model', 'illust', 'picture'],
    button: ['time', 'benefit', 'sugget'],
    keytopic: ['TOPIC1', 'TOPIC2', 'TOPIC3'],
    keyword: ['KW1', 'KW2', 'KW3'],
    trigger: ['TRIGGER'],
    adcopy: ['adcopy'],
};
const dw31 = defaultRect.w * 1/3.0;
const dw32 = 2*dw31;
const dh2 = defaultRect.h * 1/2.0;
const dh4 = dh2/2.0;
const objetRects = {
    left: { x: dw31, w: dw32},
    right: { x: dw31, w: dw32},
    center: { w: dw31 },    // preserve right for button
    between: { x: dw31, w: dw31},
}
const textRects = {
    left: { x: 10, w: dw32 },
    right: { x: dw31, w: dw32-10 },
    center: { x: dw31, w: dw31 }, 
    between: { x: 10, w: dw32 }, // preserve right for button
}
const buttonRects = {
    left: {x: dw31, w: dw31-10, y: dh4, h: dh2},
    right: {x: 10, w: dw31-10, y: dh4, h: dh2},
    center: {x: dw31, w: dw31-10, y: dh4, h: dh2},
    between: {x: dw31, w: dw31-10, y: dh4, h: dh2},
};


class CreativePreview extends React.Component {
    constructor(ps) {
        super(ps);

        this.state= classes.reduce((obj, cls)=> {
                let cv = sample_values[cls][Math.ceil(Math.random()*sample_values[cls].length)];
                obj = Object.assign(obj, {[cls]: cv});
                return obj;
            }, {});
    }

    _pvCompUrl(cls) {
        return '/img/preview/'+cls+'_'+this.state[cls]+'.png';
    }

    _renderStyleBackground() {
        return {
            border: '1px solid var(--bg-dark)',
            backgroundImage: 'url('+this._pvCompUrl('background')+')',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
        }
    }

    _renderStyleLayout() {
        switch(this.state.layout) {
            case 'left': return {
                justifyContent: 'start',
            };
            case 'right': return {
                justifyContent: 'end',
                flexDirection: 'row-reverse',
            };
            case 'center': return {
                justifyContent: 'center',
            }
            case 'between': return {
                justifyContent: 'space-between',
            }
        }
    }

    _renderStyleCSS() {
        if(!this.state || Object.keys(this.state).length<=0) return [];
        return ['creative-preview', 'shadow-sm'].concat(
            Object.keys(this.state)
                .filter((cls)=>0<=classes.indexOf(cls))
                .map((cls)=>cls +'-'+ this.state[cls]));
    }

    _renderStyleElements() {
        let renderTexts = AttributeMeta.Message.classes()
            .map((cls)=>{
                return {
                    c: cls, 
                    e: <p className={['creative-preview-text', cls].join(' ')}>{this.state[cls]}</p>,
                };
            });
        let renderObjet = <img className="creative-preview-objet" src={this._pvCompUrl('objet')} />;
        let renderButton = <button className={['btn', 'creative-preview-button'].join(' ')}>{this.state.button}</button>;


        switch(this.state.layout) {
            case 'right':
                return [renderObjet, renderButton]
                    .concat(renderTexts.map((t)=>t.e));
            case 'center':
                return [renderObjet]
                    .concat(renderTexts.map((t)=>t.e))
                    .concat([renderButton]);
            case 'between':
                let ret = renderTexts.map((t)=>t.e);
                ret.splice(Math.ceil(renderTexts.length/2), 0, 
                    <div className="creative-preview-ctrl d-flex flex-column">{renderObjet}{renderButton}</div>);
                return ret;
            case 'left': // text elements first, image and button
            default:
                return renderTexts.map((t)=>t.e)
                    .concat([renderObjet, renderButton]);
        }
    }
    
    render() {
        return (<div className={this._renderStyleCSS().join(' ')}>
            {this._renderStyleElements().map((el)=>el)}
        </div>);
    }
}

export default CreativePreview;