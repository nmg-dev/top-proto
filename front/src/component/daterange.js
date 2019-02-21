import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const DATE_FORMAT = 'YYYY-MM-DD';
const MONTH_FORMAT = 'YYYY-MM';
const TITLE_FORMAT = 'MMM.YYYY';

const TODAY = moment().format(DATE_FORMAT);

class DateRange extends React.Component {
    static defaultProps = {
        moveMonth: true,
        moveYear: true,
        titleFormat: TITLE_FORMAT,
        weekStart: 0,
        presets: [],
        calendar: moment().format(MONTH_FORMAT),
        selected: TODAY,
        // disabledBefore: null,
        // disabledAfter: null,
    }
    constructor(props) {
        super(props);
        /* props
        * moveMonth
        * moveYear
        * titleFormat
        * weekStart
        * presets
        */

        this.state = {
            calendar: props.calender || moment().format(MONTH_FORMAT),
            dateFrom: props.dateFrom,
            dateTill: props.dateTill,
            disabledBefore: props.disabledBefore,
            disabledAfter: props.disabledAfter,
            focused: null,
            selected: props.selected,
            show: true,
            showPresets: false,
        };

        this.onClick = this._clk;
    }

    _clk(ev) {
        console.log('daterange clicked', ev);
        ev.preventDefault();
        ev.stopPropagation();
        ev.nativeEvent.stopImmediatePropagation();
    }

    _dateRanged(group, name) {
        if(group && group[name]) {
            let m = group[name];
            m.hour(0); 
            m.minute(0); 
            m.second(0); 
            m.millisecond(0);
            return m;
        } else {
            return null;
        }

    }

    renderSelectorPresets() {
        if(this.props.presets && 0<this.props.presets.length) {
            return (<div className="dropdown-menu">
                {this.props.presets.map((ps,idx)=>(
                    <a href="#" preset-idx={idx}
                        className="dropdown-item bs-daterange-preset-item">
                        {ps.title}
                        <small preset-idx={idx}>{ps.desc}</small>
                    </a>
                ))}
            </div>);
        } else {
            return (<span className="input-group-text"><i className="fas fa-calendar-alt"></i></span>);
        }
    }

    renderSelectorComponent() {
        return (<div className="bs-daterange-wrapper bs-daterange-selector">
            <div className="input-group bs-daterange-selector-group b-1">
                <div className="input-group-prepend">
                    {this.renderSelectorPresets()}
                </div>
                <input className="form-control bs-daterange-period bs-daterange-from" placeholder="${DATE_FORMAT}" name="from" value={moment(this.state.dateFrom).format(DATE_FORMAT)} readOnly />
                <span className="input-group-text">-</span>
                <input className="form-control bs-daterange-period bs-daterange-till" placeholder="${DATE_FORMAT}" name="till" value={moment(this.state.dateTill).format(DATE_FORMAT)} readOnly />
                <div className="input-group-append">
                    <button className="btn btn-primary bs-daterange-selector-submit"><i className="fas fa-check"></i></button>
                </div>
            </div>
        </div>);
    }

    renderCalendarComponentTable() {
        let weekdays = [];
        let mdays = [];
        for(let w=0; w<7; w++)
            weekdays[w] = moment.weekdaysShort((w+this.props.weekStart)%7);
        
        let _dbase = moment(this.state.calendar);
        let dcursor = moment(this.state.calendar);
        let the_month = dcursor.format(MONTH_FORMAT);

        // move calendar date
        _dbase.date(1);
        dcursor.date(1);
        dcursor.add('day', this.props.weekStart - dcursor.weekday());

        let range_from = this._dateRanged(this.state, 'dateFrom');
		let range_till = this._dateRanged(this.state, 'dateTill');
		let disabled_before = this._dateRanged(this.state, 'disabledBefore');
	    let disabled_after = this._dateRanged(this.state, 'disabledAfter');

        do {
            mdays.push(weekdays.reduce((rd,wd)=>{
                let wc = `bs-daterange-cellbody weekday-${wd} bs-daterange-the-month`;
				the_month = dcursor.format(MONTH_FORMAT);
				let the_day = dcursor.format(DATE_FORMAT);
				if(the_month!=this.state.calendar) {
					wc += dcursor.isBefore(_dbase) ? 'bs-daterange-prev-month' : 'bs-daterange-next-month';
				}
				// date selected
				if(this.state.selected == the_day) 
					wc += ' selected';
				if(range_from && range_till && dcursor.isBetween(range_from, range_till))
                    wc += ' in-range';
                if(range_from && range_from == the_day)
                    wc += ' period-from';
                if(range_till && range_till == the_day)
                    wc += ' period-till';

				// disabled
				let dlb = '';
				if((disabled_before && disabled_before.isSameOrAfter(dcursor))
				|| (disabled_after && disabled_after.isSameOrBefore(dcursor))) {
					wc += ' disabled';
					dlb = 'disabled';
				}
                rd.push(<td className={wc} data-date={dcursor.format(DATE_FORMAT)}>{dcursor.date()}</td>);
                dcursor.add(1, 'day');
                return rd;
            }, []));
        } while(the_month == this.state.calendar);
        return (<table className="bs-daterange-calendar-table">
            <thead>
                <tr>
                    {weekdays.map((wd)=>(<th className={`bs-daterange-celltitle weekday-${wd}`}>{wd}</th>))}
                </tr>
            </thead>
            <tbody>
                {mdays.map((cells)=><tr>{cells}</tr>)}
            </tbody>
        </table>);
    }

    renderCalendarComponent() {
        return (<div className="bs-daterange-wrapper bs-daterange-calendar">
            <div className="input-group">
                <div className="input-group-prepend">
                    <button className="btn bs-daterange-control bs-daterange-prev bs-daterange-year"
                        onClick={(ev)=>{this.setState({calendar: moment(this.state.calendar).add(-1, 'year').format(MONTH_FORMAT)}); this._clk(ev); }}>
                        <i className="fas fa-angle-double-left"></i>
                    </button>
                    <button className="btn bs-daterange-control bs-daterange-prev bs-daterange-month"
                        onClick={(ev)=>{this.setState({calendar: moment(this.state.calendar).add(-1, 'month').format(MONTH_FORMAT)}); this._clk(ev); }}>
                        <i className="fas fa-angle-left"></i></button>
                </div>
                <input className="form-control bs-daterange-calendar-month" type="text" value={moment(this.state.calendar).format(this.props.titleFormat)} disabled />
                <div className="input-group-append">
                    <button className="btn bs-daterange-control bs-daterange-next bs-daterange-month"
                        onClick={(ev)=>{this.setState({calendar: moment(this.state.calendar).add(1, 'month').format(MONTH_FORMAT)}); this._clk(ev); }}>
                        <i className="fas fa-angle-right"></i></button>
                    <button className="btn bs-daterange-control bs-daterange-next bs-daterange-year"
                        onClick={(ev)=>{this.setState({calendar: moment(this.state.calendar).add(1, 'year').format(MONTH_FORMAT)}); this._clk(ev); }}>
                        <i className="fas fa-angle-double-right"></i>
                    </button>
                </div>
            </div>

            {this.renderCalendarComponentTable()}
        </div>);
    }

    render() {
        return (<div className="daterange">
            {this.renderSelectorComponent()}
            {this.renderCalendarComponent()}
        </div>);
    }
}

DateRange.propTypes = {
    moveMonth: PropTypes.bool,
    moveyear: PropTypes.bool,
    titleFormat: PropTypes.string,
    weekStart: PropTypes.number,
    presets: PropTypes.array,

    calendar: PropTypes.string,
    dateFrom: PropTypes.string,
    dateTill: PropTypes.string,
    disabledBefore: PropTypes.string,
    disabledAfter: PropTypes.string,
    focused: PropTypes.string,
    selected: PropTypes.string,
}

export default DateRange;