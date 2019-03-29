import React from 'react';
import AttributeMeta from '../module/attrMeta';

import './creativePreview.css';

const ImagePath = `/img/preview`;

const BackgroundTypes = {
    '공백': 'blank',
    '단색_밝은색': 'solid_light',
    '단색_어두운색': 'solid_dark',
    '면분할': 'split',
};
const ObjetTypes = {
    '모델': 'model',
    '일러스트': 'illust',
    '실사': 'picture',
    '텍스트': '',
};
const LayoutObjets = {
        '좌측': { x: "75%", y: "5%", h: '90%' },
        '우측': { x: "25%", y: "5%", h: '90%' },
        '중앙': { x: "5%", y: "5%", h: '90%' },
        '좌우': { x: "40%", y: "5%", h: '90%' },
    // '정방형': {
    //     '좌측': { x: "75%", y: "15%", h: '90%' },
    //     '우측': { x: "25%", y: "15%", h: '90%' },
    //     '중앙': { x: "5%", y: "5%", h: '90%' },
    //     '좌우': { x: "40%", y: "15%", h: '90%' },
    // },
    // '세로형': {
    //     '좌측': { x: "5%", y: "75%", h: '30%' },
    //     '우측': { x: "5%", y: "25%", h: '30%' },
    //     '중앙': { x: "5%", y: "15%", h: '30%' },
    //     '좌우': { x: "5%", y: "30%", h: '30%' },
    // },
    // '원형': {
    //     '좌측': { x: "75%", y: "25%", h: '50%' },
    //     '우측': { x: "25%", y: "25%", h: '50%' },
    //     '중앙': { x: "30%", y: "5%", h: '50%' },
    //     '좌우': { x: "30%", y: "25%", h: '50%' },
    // }
}

class CreativePreview extends React.Component {
    constructor(ps) {
        super(ps);

        console.log(ps);

        this._canvas = React.createRef();
        this._context = null;
    }

    renderBackgroundImage() {
        let bg = this.props.meta['design.background'].name;
        return <image 
            x="0" y="0" width="100%" height="100%" preserveAspectRatio="0"
            href={`${ImagePath}/background_${BackgroundTypes[bg]}.png`} />
    }

    renderContentText() {
        // let shape = this.props.meta['design.shape'];
        let layout = this.props.meta['design.layout'].name;
        let text = this.props.meta['content.adcopy'].name;
        switch(layout) {
            case '좌측': 
                return <text x="5%" y="50%" fill="grey">{text}</text>;
            case '우측':
                return <text x="75%" y="50%" fill="grey">{text}</text>;
            case '좌우':
                return [
                    <text x="75%" y="50%" fill="grey">{text}</text>,
                    <text x="5%" y="50%" fill="grey">{text}</text>
                ];
            default:
            case '중앙':
                return <text x="50%" y="50%" fill="grey">{text}</text>;
        }
    }

    renderButtonImage() {
        let layout = this.props.meta['design.layout'].name;
        let text = this.props.meta['content.trigger'].name;

        let btnLayout;
        let btnType;
        switch(layout) {
            case '좌측': 
                btnLayout = {x: '90%', y: '50%', h: '40%'}; break;
            case '우측':
                btnLayout = {x: '10%', y: '50%', h: '40%'}; break;
            case '좌우':
                btnLayout = {x: '55%', y: '50%', h: '40%'}; break;
            default:
            case '중앙':
                btnLayout = {x: '90%', y: '50%', h: '40%'}; break;
        }
        
        switch(text) {
            case 'User Persuasive Text':
                btnType = 'suggest'; break;
            case 'Emphasize Reward':
                btnType = 'reward'; break;
            case 'Highlight benefits':
                btnType = 'benefit'; break;
            case 'Include Seasonlaity':
                btnType = 'season'; break;
            case 'Create Ungency':
                btnType = 'time'; break;
            case 'Esatablish credibility':
                btnType = 'credible'; break;
        }

        return <image href={`${ImagePath}/button_${btnType}`}
            x={btnLayout.x} y={btnLayout.y} height={btnLayout.h} preserveAspectRatio="1" />;

    }

    renderObjetImage() {
        // let shape = this.props.meta['design.shape'].name;
        let layout = this.props.meta['design.layout'].name;
        let objet = this.props.meta['design.objet'].name;
        let x = LayoutObjets[layout].x || '30%';
        let y = LayoutObjets[layout].y || '5%';
        let h = LayoutObjets[layout].h || '50%';

        return <image
            x={x} y={y} height={h} preserveAspectRatio="1"
            href={`${ImagePath}/objet_${ObjetTypes[objet]}.png`} />
    }


    render() {        
        return (<svg ref={this._canvas} style={{width: '100%', height: '120px'}} 
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            {this.renderBackgroundImage()}
            {this.renderObjetImage()}
            {this.renderContentText()}
            {this.renderButtonImage()}
        </svg>);
    }
}

export default CreativePreview;