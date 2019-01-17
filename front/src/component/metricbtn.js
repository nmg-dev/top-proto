import React from 'react';
import ApplicationContext from '../AppContext';
import Metric from '../module/metric';

const styles = {
    btn: {
        backgroundColor: '#fff',
        display: 'flex',
        minWidth: '5vw',
        alignItems: 'flex-start'
    }
}


class MetricBtn extends React.Component {
    // static contextType = ApplicationContext;
    constructor(ps) {
        super(ps);

        this.state = this.props.initStage ? this.props.initStage : {
            kpi: Metric.DefaultKey(),
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
        return this.state.kpi.toUpperCase();
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
        return (<div className="button-group kpi-control">
            <button type="input-group-btn" className="btn shadow-sm"
                style={styles.btn}
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div className="label-icon"><i className="fas fa-ruler" /></div>
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
                    return (<a key={m.key()} href="#" className={clsName}
                        onClick={this.onClickItem.bind(this)}>
                        {m.label()}
                    </a>);
                })}
            </div>
        </div>);
    }
}

export default MetricBtn;