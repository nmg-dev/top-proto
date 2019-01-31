class Metric {
    constructor(key, label, fn, fmt, _hide) {
        this._k = key;
        this._label = label;
        this.calc = fn;
        this._fmt = fmt;
        this._hide = _hide;
    }

    key() {
        return this._k;
    }

    label() {
        return this._label;
    }

    format(value) {
        if(value!=null)
            return this._fmt(value);
        else
            return '';
    }

    value(x) {
        if(x[this._k])
           return x[this._k];
        else 
            return this.calc(x);
    }

    valueString(x) {
        return this._fmt(x);
    }

    /* const */
    static CPC = new Metric('cpc', 'CPC', 
        (v) => (v.clk/Math.max(1,v.cost)),
        (v)=> v.toLocaleString()+ 'KRW' );
    static CPA = new Metric('cpa', 'CPA',
        (v) => (v.cnv/Math.max(1,v.cost)),
        (v)=> v.toLocaleString()+ 'KRW');
    static CTR = new Metric('ctr', 'CTR',
        (v) => (v.clk/Math.max(1,v.imp)),
        (v) => (100*v).toFixed(4)+' %');
    static CVR = new Metric('cvr', 'CVR',
        (v) => (v.cnv/Math.max(1,v.imp)),
        (v) => (100*v).toFixed(4)+' %' );
    static COUNT = new Metric('cnt', 'COUNT',
        () => 1, (v)=>v.toLocaleString(), true);

    static ALL = [
        Metric.CPC, 
        Metric.CPA, 
        Metric.CTR, 
        Metric.CVR, 
        Metric.COUNT, 
    ];
    static List(includeHidden) {
        return Metric.ALL
            .filter((m)=>includeHidden || !m._hide);
    }
    static Keys(includeHidden) {
        return Metric.ALL
            .filter((m)=>includeHidden || !m._hide)
            .map((m)=>m._k);
    }
    static ByKey(mk) {
        // return Metric.ALL.reduce((found,m)=>found=(!found && m._k===mk ? m: found));
        let filtered = Metric.ALL.filter((m)=>m._k===mk);
        return (filtered && 0<filtered.length ? filtered[0] : null); 
    }
    static DefaultKey() {
        return Metric.CPC._k;
    }
}

export default Metric;