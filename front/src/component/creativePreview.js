import React from 'react';
import AttributeMeta from '../module/attrMeta';

import './creativePreview.css';

const components = {
    background: {
        blank: 'background_blank',
        image: 'background_image',
        solid_dark: 'background_solid_dark',
        solid_light: 'background_solid_light',
        split: 'background_split',
    },
    objet: {
        illust: 'objet_illust',
        model: 'objet_model',
        picture: 'objet_picture',
    },
    button: {
        benefit: 'button_benefit',
        suggest: 'button_suggest',
        time: 'button_time',
    },
    layout: {
        left: 'layout_left',
        right: 'layout_right',
        between: 'layout_between',
        center: 'layout_center',
    }
}

class CreativePreview extends React.Component {
    constructor(ps) {
        super(ps);

        this.state={
            ...this.props
        };

        this._canvas = React.createRef();
        this._context = null;
    }

    componentDidMount() {
        this.onUpdateDraw();
    }

    componentDidUpdate() {
        this.onUpdateDraw();
    }

    _imageLoadingCanvas(src, dx, dy, dw, dh) {
        dx = dx || 0;
        dy = dy || 0;
        dw = dw || this._canvas.current.width;
        dh = dh || this._canvas.current.height;

        let img = new Image();
        img.src = src;
        img.onload = ((ev) => {
            console.log(src, dx, dy, dw, dh);
            this._context.drawImage(img, dx, dy, dw, dh);
        });
    }

    onUpdateDraw() {
        // console.log('preview updated', this._canvas);
        // if(this._canvas.current) {
        //     if(!this._context) 
        //         this._context = this._canvas.current.getContext('2d');
        //     this._imageLoadingCanvas(`/img/preview/background_split.png` );
        //     this._imageLoadingCanvas(`/img/preview/objet_model.png`, 10, 10);
        //     this._imageLoadingCanvas(`/img/preview/button_benefit.png`, 20, 20);
        // }
    }
    render() {
        return (<svg ref={this._canvas} style={{width: '100%', height: '120px'}} 
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <image href={`/img/preview/background_split.png`} x="0" y="0" width="100%" preserveAspectRatio="true" />
            <image href={`/img/preview/objet_model.png`} x="50%" y="10%" width="20%" preserveAspectRatio="true" />
            <image href={`/img/preview/button_benefit.png`} x="75%" y="25%" width="10%" preserveAspectRatio="true" />
        </svg>);
    }
}

export default CreativePreview;