import React from 'react';

const styles = {
    btn: {
        backgroundColor: '#fff',
        display: 'flex',
        minWidth: '5vw',
        alignItems: 'flex-start'
    }
}

const METRICS = [
    {key: 'cpc', calc: (v) => (v.clk/Math.max(1,v.cost)), fmt: (v)=> v.toLocaleString()+ 'KRW' },
    {key: 'cpa', calc: (v) => (v.cnv/Math.max(1,v.cost)), fmt: (v)=> v.toLocaleString()+ 'KRW' },
    {key: 'ctr', calc: (v) => (v.clk/Math.max(1,v.imp)), fmt: (v) => (100*v).toFixed(4)+' %' },
    {key: 'cvr', calc: (v) => (v.cnv/Math.max(1,v.imp)), fmt: (v) => (100*v).toFixed(4)+' %' },
    {key: 'cnt', calc: (v) => 1, hide: true, fmt: (v)=> v.toLocaleString()+ '.' },
];

class MetricBtn extends React.Component {
    constructor(ps) {
        super(ps);

        this.state = this.props.initStage ? this.props.initStage : {
            kpi: METRICS[0].key,
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
                {METRICS.filter((m)=>!m.hide).map((m)=> {
                    let clsName = 'dropdown-item';
                    if(m.key===this.state.kpi)
                        clsName += ' active';
                    return (<a key={m.key} href="#" className={clsName}
                        onClick={this.onClickItem.bind(this)}>
                        {m.key.toUpperCase()}
                    </a>);
                })}
            </div>
        </div>);
    }
}

export default MetricBtn;