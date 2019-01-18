import React from 'react';
import moment from 'moment';

// const DATE_FORMAT = 'YYYY-MM-DD';

class PeriodBtn extends React.Component {
    static DATE_FORMAT = 'YYYY-MM-DD';
    constructor(ps) {
        super(ps);

        this.state = {
            from: moment().add('-3 months'),
            till: moment()
        }
    }

    render() {
        return (<div className="button-group query-control top-control" style={{marginRight: 0}}>
            <button type="input-group-btn" className="btn shadow-sm period-control"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div className="label-icon">
                    <img src="/img/icon-calendar.png" alt="calendar icon" />
                </div>
                <div className="label-text text-muted">
                    {this.state.from.format(PeriodBtn.DATE_FORMAT)}
                     ~ 
                    {this.state.till.format(PeriodBtn.DATE_FORMAT)}
                </div>
                <i className="fas fa-chevron-down" />
            </button>
        </div>);
    }
}

export default PeriodBtn;