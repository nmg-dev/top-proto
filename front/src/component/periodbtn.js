import React from 'react';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';


const styles = {
    btn: {
        display: 'flex',
        alignItems: 'center',
    },
    labels: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    }
}

class PeriodBtn extends React.Component {
    constructor(ps) {
        super(ps);

        this.state = {
            from: moment().add('-3 months'),
            till: moment()
        }
    }

    render() {
        return (<div class="button-group kpi-control">
            <button type="input-group-btn" className="btn shadow-sm" disabled
                style={styles.btn}
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div class="label-icon"><i class="fas fa-calendar" /></div>
                <div class="label-text">
                    <b>{this.props.title}</b>
                    <div class="text-muted">
                        {this.state.from.format(DATE_FORMAT)}
                        ~
                        {this.state.till.format(DATE_FORMAT)}
                    </div>
                </div>
                <i class="fas fa-chevron-down" />
            </button>
        </div>);
    }
}

export default PeriodBtn;