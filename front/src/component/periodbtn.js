import React from 'react';
import { DateRange } from 'react-date-range';
// yg.song;  nooooooo...222 (20190121)
import $ from 'jquery';
// import Popperjs from 'popper.js';

// const DATE_FORMAT = 'YYYY-MM-DD';

const daterangeStyle = {
    position: 'absolute', 
    marginTop: 2, 
    right: 0, 
    border: '1px solid var(--bg-dark)', 
    width: 564, 
    zIndex: 99,
    backgroundColor: '#fff',
};

class PeriodBtn extends React.Component {
    static DATE_FORMAT = 'YYYY-MM-DD';
    constructor(ps) {
        super(ps);

        // this._ref = React.createRef();
        this._range = React.createRef();

        this.state = {
            from: this.props.from,
            till: this.props.till,
            showRange: false
        }
    }

    showPopover(ev) {
        this.setState({showRange: !this.state.showRange});
    }
    disposePopover() {
        this.setState({showRange: false});
    }

    onCalendarChanged(ev) {
        this.setState({
            showRange: false,
            from: this._range.current.state.range.startDate,
            till: this._range.current.state.range.endDate,
        });
    }

    render() {
        return (
            <div className="button-group query-control top-control" style={{marginRight: 0}}>
            <button ref={this._ref}
                type="input-group-btn" className="btn shadow-sm period-control"
                onClick={this.showPopover.bind(this)}>
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
            {this.state.showRange ? <div style={daterangeStyle} onBlur={this.disposePopover.bind(this)}>
            <DateRange 
                ref={this._range}
                startDate={this.state.from} 
                endDate={this.state.till} /> 
                <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-default-outline m-1 p-1"
                        onClick={()=>this.setState({showRange: false})}>
                        Close
                    </button>
                    <button type="button" className="btn btn-default-outline m-1 p-1"
                        onClick={this.onCalendarChanged.bind(this)}> OK </button>
                </div>
            </div>: ''}
        </div>);
    }
}

export default PeriodBtn;