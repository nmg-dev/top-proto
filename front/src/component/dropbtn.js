import React from 'react';

const styles = {
    btn: {
        backgroundColor: '#fff',
        display: 'flex',
        minWidth: '5vw',
        alignItems: 'flex-start'
    }
}

class DropBtn extends React.Component {
    constructor(ps) {
        super(ps);

        this.state = this.props.initStage ? this.props.initStage : {
            label: this.props.label,
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
        return (<div className="button-group query-control">
            <button type="input-group-btn" className="btn query-btn shadow" disabled
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                {this.props.options.map(this.renderItem.bind(this))}
            </div>
        </div>);
    }
}

export default DropBtn;