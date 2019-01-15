import React from 'react';
import CategoryBtn from './categorybtn';

const sample_cls = {
    copy: {
        title: 'Copy Type',
        labels: [
            'Key topic',
            'Keyword',
            'Trigger',
            'Ad Copy',
        ]
    },
    design: {
        title: 'Design Type',
        labels: [
            'Background',
            'Object',
            'Layout',
            'Button Type',
        ],
    }
}

class CategoryBar extends React.Component {
    constructor(ps) {
        super(ps);
    }

    render() {
        return(<div className="categorybar flex-container">
            <div className="row">
            {Object.keys(sample_cls).map((cls) => (<div className={'col col-sm-12 col-md-6 '+cls}>
                <h3>{sample_cls[cls].title}</h3>
                <div className="categorybar-subwrapper row">
                    {sample_cls[cls].labels.map((lb) => (<div className="col m-0 p-0">
                        <h5>{lb}</h5>
                        <div className="button-group category-control">
                            <CategoryBtn placeholder="All" options={[]} /> 
                        </div>
                    </div>))}
                </div>                
            </div>))}
            </div>
        </div>);
    }
}

export default CategoryBar;