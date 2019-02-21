import React from 'react';
import moment from 'moment';
import './periodbtn.css';

const WEEK_STARTING_SUNDAY = 0;
const WEEK_STARTING_MONDAY = 1;

// const DATE_FORMAT = 'YYYY-MM-DD';
class PeriodBtn extends React.Component {
    static DATE_FORMAT = 'YYYY-MM-DD';
    constructor(ps) {
        super(ps);

        // this._ref = React.createRef();
        this._range = React.createRef();

        this.state = {
            from: this.props.from,
            till: this.props.till,
            showRange: false,

            // calendar settings
            focusing: this.props.today,
            title_format: 'YYYY년 MM월',
            week_format: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri','Sat'],
            week_starting: WEEK_STARTING_SUNDAY,
            controls: [
                {label: '한 달', from: ()=>{}, till: ()=>{}},
                {label: '분기', from: ()=>{}, till: ()=>{}},
                {label: '일 년', from: ()=>{}, till: ()=>{}},
            ],
        }
    }

    componentDidMount() {
        window.__updateApplicationPeriod = ((daterange)=>{
            console.log('period updated', daterange.value, this);
            this.setState({
                from: moment(daterange.value.from),
                till: moment(daterange.value.till),
            });
        }).bind(this);
        eval(`$('.daterange').daterange({
            onSelected: function(ev,range) {
                window.__updateApplicationPeriod(range);
            }
        });`);
        eval(`$('.daterange').on('changed.bs.daterange', function(ev, from, till) {
            window.__updateApplicationPeriod({from: from, till: till});
        })`)
    }

    getSelected() {
        return {
            from: this.state.from,
            till: this.state.till
        };
    }

    onItemChanged() {
        if(this.props.onChange) 
            this.props.onChange({
                from: this.state.from,
                till: this.state.till,
            });
    }

    showPopover(ev) {
        this.setState({showRange: !this.state.showRange}, this.onItemChanged.bind(this));
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

    _renderPeriodPickerMenuCalendarDays(focusing, from, till) {
        // the_month 
        let dcursor = moment(focusing);
        let the_month = dcursor.format('YYYYMM');
        // set first day of the month
        dcursor.date(1);
        // to first day of the week
        while(dcursor.weekday()!=this.state.week_starting) {
            dcursor.add('day', -1);
        }
        let days = [];
        do {
            for(let i=0; i<7; i++) {
                days.push({
                });
            }

        } while(dcursor.format('YYYYMM') == the_month);


    }

    renderPeriodPickerMenuTable() {

    }

    renderPeriodPickerMenu() {

        return (<div className="dropdown-menu d-flex flex-columns">
            <div className="d-flex picker-calendar">
                <div className="picker-calendar-head">
                </div>

                <table className="picker-calendar-body">
                    <thead>
                        <tr>
                            {this.state.week_order.map((wd)=>
                            <th weekday={wd}>{this.state.week_format(wd)}</th>)}
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
                <div className="input-groups picker-calendar-foot">
                    <input type="date" className="from form-control" />
                    <input type="date" className="till form-control" />
                </div>
            </div>
            <div className="d-flex">
            </div>
        </div>);
    }

    _onPeriodSelect(ev, period) {
        console.log('period selected', period);
    }

    render() {
        return (<div className="button-group query-control top-control">
            
            <button ref={this._ref}
                type="input-group-btn" className="btn period-control"
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
            <div className="dropdown-menu p-1">
                <div className="daterange"></div>
            </div>
        </div>);
    }
}

export default PeriodBtn;