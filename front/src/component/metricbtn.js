import React from 'react';
import Metric from '../module/metric';
import DropBtn from './dropbtn';


class MetricBtn extends DropBtn {
    constructor(ps) {
        super(ps);

        this.state = this.props.initStage ? this.props.initStage : {
            kpi: this.props.kpi,
        };
    }

    onClickItem(ev) {
        let key = ev.target.getAttribute('value');
        // let vals = this.values;
        if(key) {
            this.setState({kpi: key}, this.onItemChanged.bind(this));
        }
    }

    onItemChanged() {
        console.log(this.props.onChange, this.state.kpi);
        if(this.props.onChange) 
            this.props.onChange(this.state.kpi);
    }

    displayText() {
        return this.state.kpi.toUpperCase();
    }


    render() {
        return (<div className="button-group query-control top-control">
            <button type="input-group-btn" className="btn"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div className="label-icon m-0 p-0">
                    <img src="/img/icon-metric.png" />
                </div>
                <div className="label-text text-muted">
                    {this.displayText()}
                </div>
                <i className="fas fa-chevron-down" />
            </button>
            <div className="dropdown-menu">
                {Metric.List().map((m)=> {
                    let clsName = 'dropdown-item';
                    if(m.key()===this.state.kpi)
                        clsName += ' active';
                    return (<a key={'metric-'+m.key()} value={m.key()} href="#" className={clsName}
                        onClick={this.onClickItem.bind(this)}>
                        {m.label()}
                    </a>);
                })}
            </div>
        </div>);
    }
}

export default MetricBtn;