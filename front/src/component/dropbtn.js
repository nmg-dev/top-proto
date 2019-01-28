import React from 'react';

class DropBtn extends React.Component {
    constructor(ps) {
        super(ps);

        this.state = this.props.initStage ? this.props.initStage : {
            label: this.props.label,
            values: [],
        };
    }

    getSelected() {
        if(!this.props.multi) {
            return (this.state.values && 0<this.state.values.length) ? this.state.values[0] : null;
        } else {
            return this.state.values;
        }
    }

    onItemChanged() {
        if(this.props.onChange) 
            this.props.onChange(this.state.values);
    }

    onClickItem(ev) {
        let key = ev.target.getAttribute('value');
        let vals;
        if(key) {
            if(this.props.multi) {
                vals = this.state.values.concat(this.props.options
                    .filter((opt)=>opt.value==key)
                    .map((opt)=>opt.value));
            } else {
                let selected;
                vals = this.props.options
                    .filter((opt)=>{selected = !selected && opt.value==key; return selected })
                    .map((opt)=>opt.value);
            }
            this.setState({values: vals}, this.onItemChanged.bind(this));
        } else if(key==="") { // reset
            this.setState({values: []}, this.onItemChanged.bind(this));
        }
    }

    displayText() {
        if(this.props.placeholder && this.state.values.length<=0) {
            return this.props.placeholder;
        } else {
            // console.log(this.props.options, this.state.values);
            return this.props.options
                .filter((opt)=>0<=this.state.values.indexOf(opt.value))
                .map((opt)=>opt.label)
                .join(',');
        }
    }

    renderItem(opt) {
        let clsName = 'dropdown-item';
        if(0<=this.state.values.indexOf(opt.key))
            clsName += ' active';
        return (<a key={opt.value} value={opt.value} className={clsName} href="#"
            onClick={this.onClickItem.bind(this)}>
                {opt.label}
            </a>);
    }

    render() {
        return (<div className="button-group query-control">
            <button type="input-group-btn" className="btn query-btn shadow" 
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                title={this.displayText()}>
                <div className="label-icon">{this.props.icon}</div>
                <div className="label-text">
                    <b>{this.props.title}</b>
                    <div className="text-muted">
                        {this.displayText()}
                    </div>
                </div>
                <i className="fas fa-chevron-down" />
            </button>
            <div className="dropdown-menu">
                {this.renderItem({value: "", label: "ALL"})}
                <div className="dropdown-divider"></div>
                {this.props.options.map(this.renderItem.bind(this))}
            </div>
        </div>);
    }
}

export default DropBtn;