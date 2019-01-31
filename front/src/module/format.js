import moment from 'moment';

class ModFormat {
    static _monthWeek = {};

    static dateFormatDaily(m) {
        return m.format('YYYY-MM-DD');
    }
    static dateFormatWeekly(m) {
        let wk = m.isoWeeks();
        let mo = m.format('YYYY-MM');
        if(!ModFormat._monthWeek[mo])
            ModFormat._monthWeek[mo] = moment(m.format('YYYY-MM-01T00:00:00')).isoWeeks();
        let wo = ModFormat._monthWeek[mo];
        if(wo<=wk)
            wk -= wo;
        return m.format('YYYY-MM '+(wk+1)+'주차');
    }

    static dateFormatMonthly(m) {
        return m.format('YYYY-MM');
    }
    static dateFormatYearly(m) {
        return m.format('YYYY년');
    }

    static autoPeriodFormat(period, radix) {
        let days = Math.abs(period.from.diff(period.till, 'days'));
        let maps = [
            ModFormat.dateFormatDaily,
            ModFormat.dateFormatWeekly,
            ModFormat.dateFormatMonthly,
            ModFormat.dateFormatYearly,
        ];
        let levels = 0;
        console.log(days, radix, levels);
        while(levels<=maps.length-1 && radix<days) {
            days /= radix;
            levels +=1;
        }
        console.log(days, radix, levels);
        if(maps.length-1 < levels)
            levels = maps.length-1;
        return maps[levels];
    }
}

export default ModFormat;