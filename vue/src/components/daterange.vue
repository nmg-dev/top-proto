<template>
    <b-dropdown variant="default" right no-caret ref="caldrop" class="period-control">
        <template slot="button-content">
            <div class="label-icon">
                <img src="../assets/icon-calendar.png" alt="period" />
            </div>
            <div class="label-text text-muted">
                {{ momentFrom }} ~ {{ momentTill }}
            </div>
            <i class="fas fa-chevron-down" />
        </template>
        <b-dropdown-form class="daterange-form">
            <b-input-group>
                <b-input-group-prepend>
                    <b-button variant="default" disabled><i class="fas fa-calendar" /></b-button>
                </b-input-group-prepend>
                <b-input class="selection from" type="text" :data-mselect="mode === 'from'" data-mode="from" :data-timestamp="periodFrom" readonly :value="pFrom" @click="switchMode" />
                <b-input-group-text>-</b-input-group-text>
                <b-input class="selection till" type="text" :data-mselect="mode === 'till'" data-mode="till" :data-timestamp="periodTill" readonly :value="pTill" @click="switchMode"/>
                <b-input-group-append>
                    <b-button variant="primary" class="daterange-submit" @click="submitPeriod"><i class="fas fa-check" /></b-button>
                </b-input-group-append>
            </b-input-group>
            <b-input-group>
                <b-input-group-prepend>
                    <b-button @click="moveMonths(-12)" class="btn bs-daterange-control bs-daterange-prev bs-daterange-year">
                        <i class="fas fa-angle-double-left"></i>
                    </b-button>
                    <b-button @click="moveMonths(-1)" class="btn bs-daterange-control bs-daterange-prev bs-daterange-month">
                        <i class="fas fa-angle-left"></i>
                    </b-button>
                </b-input-group-prepend>
                <b-input class="bs-daterange-calendar-month" type="text" :key="calendarMonth" :value="calendarMonth" readonly></b-input>
                <b-input-group-append>
                    <b-button @click="moveMonths(1)" class="btn bs-daterange-control bs-daterange-next bs-daterange-month">
                        <i class="fas fa-angle-right"></i>
                    </b-button>
                    <b-button @click="moveMonths(12)" class="btn bs-daterange-control bs-daterange-next bs-daterange-year">
                        <i class="fas fa-angle-double-right"></i>
                    </b-button>
                </b-input-group-append>
            </b-input-group>
            <table class="bs-daterange-calendar-table" :key="calendarMonth">
                <thead>
                    <tr>
                        <template v-for="w in weekdays">
                            <td class="weekday-w" :key="`weekday-${w.toLowerCase()}`">{{ w }}</td>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(week, widx) in calendar">
                        <tr :key="`calendar-week-${widx}`" :data-week-in-month="widx+1">
                            <template v-for="(day, didx) in week">
                                <td
                                    @click="onDateSelect"
                                    :data-year="day.y"
                                    :data-month="day.m"
                                    :data-weekday="day.w"
                                    :data-day="day.d"
                                    :data-in="day.in"
                                    :data-current="day.c"
                                    :data-from="day.f"
                                    :data-till="day.t"
                                    :data-focus="day.focused"
                                    :data-timestamp="day.ts"
                                    :data-date="$moment(day.ts).format('YYYY-MM-DD')"
                                    :key="$moment(day.ts).unix()"
                                    :class="`calendar-day`">{{ day.d }}</td>
                            </template>
                        </tr>
                    </template>
                </tbody>
            </table>
        </b-dropdown-form>
    </b-dropdown>
</template>

<script>
import utils from '../utils.js';

export default {
    name: 'daterange',
    props: {
        focus: { default: Date.now() },
        from: undefined,
        till: undefined,
        activated: { type: Function },
        selected: { type: Function },
        canceled: { type: Function },

        titleFormat: { type: String, default: 'YYYY-MM' },
    },
    watch: {
    },
    data: function() {
        return {
            mode: undefined,
            period: {from: this.from, till: this.till},
            weekdays: this.$moment.weekdaysShort(),
            periodFrom: this.from,
            periodTill: this.till,
            focused: this.$moment(this.focus),
            calendarMonth: this.$moment(this.focus).format('YYYY-MM'),
        };
    },
    computed: {
        calendar: function(){
            let calendar = [];
            let month = this.$moment(this.calendarMonth);
            let cursor = month.clone()
                .startOf('month')
                .startOf('week');
            let _thisMonth = month.month();

            do {
                let dt = cursor.toDate().getTime();
                calendar.push(this.weekdays.map((wd, widx) => {
                    let d = new Date(dt+widx*86400000);
                    d.setHours(0, 0, 0, 0);
                    let _d = d.getTime();
                    return {
                        y: d.getFullYear(),
                        m: d.getMonth() + 1,
                        d: d.getDate(),
                        w: widx,
                        in: this.periodFrom<=_d && _d<=this.periodTill,
                        c: _thisMonth == d.getMonth(),
                        f: Math.abs(this.periodFrom - _d) < 86400000,
                        t: Math.abs(this.periodTill - _d) < 86400000,
                        focus: Math.abs(this.focused - _d) < 86400000,
                        ts: _d,
                    };
                }));
                cursor = cursor.add(this.weekdays.length, 'day');
            } while(cursor.format('YYYY-MM')==this.calendarMonth);
            return calendar;
        },
        pFrom: function() {
            return this.$moment(this.periodFrom).format('YYYY-MM-DD');
        },
        pTill: function() {
            return this.$moment(this.periodTill).format('YYYY-MM-DD');
        },
        momentFrom: function() {
            return this.$moment(this.period.from).format('YYYY-MM-DD');
        },
        momentTill: function() {
            return this.$moment(this.period.till).format('YYYY-MM-DD');
        },
        periodText: function() {
            return `${this.momentFrom} - ${this.momentTill}`;
        }
    },
    methods: {
        switchMode: function(ev) {
            let el = ev.currentTarget || ev.target;
            let mode = el.dataset.mode;
            if(this.mode != mode) {
                this.mode = mode;
            }
            if(el.dataset.timestamp)
                this.calendarMonth = this.$moment(parseInt(el.dataset.timestamp)).format('YYYY-MM');
        },
        onDateSelect: function(ev) {
            let el = ev.currentTarget || ev.target;
            let ts = parseInt(el.dataset.timestamp);
            switch(this.mode) {
                case 'from': 
                    if(!this.periodTill || ts < this.periodTill)
                        this.periodFrom = ts;
                    break;
                case 'till': 
                    if(!this.periodFrom || ts > this.periodFrom) 
                        this.periodTill = ts; 
                    break;
            }
        },
        moveMonths: function(radix) {
            let nextMoment = this.$moment(this.calendarMonth).add(radix, 'month');
            let nextMonth = nextMoment.format('YYYY-MM');
            this.calendarMonth = nextMonth;
        },
        submitPeriod: function(ev) {
            this.period = {
                from: this.periodFrom,
                till: this.periodTill,
            };
            // 
            utils.setPeriod(this.period);
            
            this.$emit('periodUpdated');
            this.$refs.caldrop.hide(true);
        },
    }
}
</script>

<style>
    .period-control {
        min-width: 240px;
    }
    table.bs-daterange-calendar-table {
        min-width: 240px;
        width: 25vw;
    }

    .query-control.top-control .daterange-form {
        font-size: var(--font-size-0);
        text-align: center;
    }
    .query-control.top-control .daterange-form .input-group button {
        border: none;
    }
    .query-control.top-control .daterange-form .input-group input {
        text-align: center;
        background-color: transparent;
        border: none;
        font-size: var(--font-size-0);
    }
    .query-control.top-control .daterange-form .input-group div.input-group-text {
        background-color: transparent;
        border: none;
        font-size: var(--font-size-0);
    }
    .query-control.top-control .daterange-form .input-group input[data-mselect] {
        background-color: var(--bg-select);
        color: var(--font-grey);
    }

    .query-control.top-control  .daterange-form button.daterange-submit {
        
    }
    .query-control.top-control  .daterange-form button.daterange-submit i {
        color: var(--data-primary);
    }


    .daterange-form table tr {

    }
    .daterange-form table th {
        font-weight: 600;
        padding: calc(var(--padding-0));
    }
    .daterange-form table td {
        padding: calc(var(--padding-0));
    }
    .daterange-form table td:not([data-current]) {
        opacity: .75;
    }
    .daterange-form table td[data-in] {
        background-color: var(--bg-select);
    }
    .daterange-form table td[data-from] {
        color: var(--font-white);
        font-weight: 600;
        background-color: var(--data-secondary);
        border-radius: 50% 0 0 50%;
    }
    .daterange-form table td[data-till] {
        color: var(--font-white);
        font-weight: 600;
        background-color: var(--data-secondary);
        border-radius: 0 50% 50% 0;
    }
    .daterange-form .bs-daterange-calendar-month {
        color: var(--data-secondary);
        font-weight: 600;
    }
    
</style>