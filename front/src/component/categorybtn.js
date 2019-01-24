import React from 'react';
import DropBtn from './dropbtn';


class CategoryBtn extends DropBtn {
    constructor(ps) {
        super(ps);
        this.state = this.props.initStage ? this.props.initStage : {
            label: this.props.label,
            values: [],
        };
    }

    render() {
        return (<div className={'button-group query-control m-1 p-0 ' +this.props.className}>
            <button type="input-group-btn" className="query-btn btn"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div className={'label-text text-muted ' + this.props.labelClass}>
                    {this.displayText()}
                </div>
                <i class="fas fa-chevron-down" />
            </button>
            <div className="dropdown-menu">
                {this.renderItem({value: "", label: this.props.placeholder})}
                <div className="dropdown-divider"></div>
                {this.props.options.map(this.renderItem.bind(this))}
            </div>
        </div>);
    }
}

export default CategoryBtn;