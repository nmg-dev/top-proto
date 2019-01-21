import React from 'react';


class CategoryBtn extends React.Component {
    constructor(ps) {
        super(ps);

        this.state = this.props.initStage ? this.props.initStage : {
            values: [],
        };
    }

    onClickItem(ev) {
        let key = ev.target.getAttribute('value');
        let vals = this.values;
        if(key) {
            if(0<=vals.indexOf(key))
                vals = vals.splice(vals.indexOf(key), 1);
            else
                vals.push(key);

            this.setState({values: vals});
        }
    }

    displayText() {
        if(this.props.placeholder && this.state.values.length<=0) {
            return this.props.placeholder;
        } else {
            let vals = this.state.values;
            return this.props.options
                .filter((opt)=>0<=vals.indexOf(opt.value))
                .map((opt)=>opt.label)
                .join(',');
        }
    }

    renderItem(opt) {
        let clsName = 'dropdown-item';
        if(0<=this.state.values.indexOf(opt.key))
            clsName += ' active';
        return (<a key={opt.value} className={clsName} href="#"
            onClick={this.onClickItem.bind(this)}>
                {opt.label}
            </a>);
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
                <a className="dropdown-item" href="#">All</a>
                <div className="dropdown-divider"></div>
                {this.props.options.map(this.renderItem.bind(this))}
            </div>
        </div>);
    }
}

export default CategoryBtn;