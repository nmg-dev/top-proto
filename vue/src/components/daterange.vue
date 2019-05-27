<template>
    <b-input-group>
        <b-input-group-text>
            <img src="../assets/icon-calendar.png" alt="calendar" />
        </b-input-group-text>
        <b-form-input type="date" :value="momentFrom"></b-form-input>
        <b-form-input type="date" :value="momentTill"></b-form-input>
        <b-input-group-append>
            <b-dropdown right>
                <b-dropdown-form>
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
                                <template v-for="w in $moment.weekdaysShort()">
                                    <td class="weekday-w" :key="`weekday-${w.toLowerCase()}`">{{ w }}</td>
                                </template>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(week, widx) in calendar">
                                <tr :key="`calendar-week-${widx}`">
                                    <template v-for="(day, didx) in week">
                                        <td :class="`calendar-day ${day.month}`" :key="`calendar-w${widx}-d${didx}`">{{ day.date }}</td>
                                    </template>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </b-dropdown-form>
            </b-dropdown>
        </b-input-group-append>
    </b-input-group>
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
    data: function() {
        return {
            periodFrom: this.from,
            periodTill: this.till,
            focused: this.$moment(this.focus),
            calendarMonth: undefined,
            calendar: [],
        };
    },
    computed: {
        momentFrom: {
            get: function() {
                return this.$moment(this.periodFrom).format('YYYY-MM-DD');
            },
            set: function(v) {
                window.console.log(v);
                this.periodFrom = Date.parse(v);
                utils.setPeriod({from: this.periodFrom, till: this.periodTill});
                this.$emit('periodUpdated');
            }
        },
        momentTill: {
            get: function() {
                return this.$moment(this.periodFrom).format('YYYY-MM-DD');
                
            },
            set: function(v) {
                this.periodTill = Date.parse(v);
                utils.setPeriod({from: this.periodFrom, till: this.periodTill});
                this.$emit('periodUpdated');
            }
        }
    },
    beforeUpdate: function() { 
        this.updateValues(); 
    },
    beforeMount: function() { 
        this.focused = this.$moment(this.focus); this.updateValues(); 
    },
    methods: {
        moveMonths: function(radix) {
            let nextMoment = this.focused.add(radix, 'month');
            let nextMonth = this.focused.format(this.titleFormat || 'YYYY-MM');
            this.calendarMonth = nextMonth;
            this.$forceUpdate();
        },
        updateValues: function() {
            this.calendarMonth = this.focused.format(this.titleFormat || 'YYYY-MM');
            this.calendar = (function() {
                if(!this.focused)
                    this.focused = this.$moment();
                let theMonth = '' + this.focused.format('YYYY-MM');
                let cursor = this.$moment(this.focused.valueOf())
                    .startOf('month')
                    .startOf('week');
                let cMonth;
                let _cal = [];
                do {
                    let _wds = Array(7);
                    for(let w=0; w<7; w++) {
                        cursor = cursor.day(w);
                        cMonth = cursor.format('YYYY-MM');
                        _wds[w] = {
                            month: cMonth, 
                            date: cursor.date().toString(), 
                            title: cursor.format('YYYY-MM-DD')
                        };
                        cursor.add(1, 'day');
                    }
                    _cal.push(_wds);
                } while(cMonth===theMonth);

                return _cal;
            }).bind(this)();

            this.$forceUpdate();
        },
    }
}
</script>