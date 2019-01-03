import moment from 'moment';
import Listenable from './listenable';

const PREDEFINED_CATEGORIES = ['category', 'goal', 'channel', 'media'];
const TOPMOST_CATEGORIES = ['layout', 'background', 'objet', 'button'];
const PREDEFINED_METRICS = [
    {key: 'cpc', calc: (v) => (v.clk/Math.max(1,v.cost)) },
    {key: 'cpa', calc: (v) => (v.cnv/Math.max(1,v.cost)) },
    {key: 'ctr', calc: (v) => (v.clk/Math.max(1,v.imp)) },
    {key: 'cvr', calc: (v) => (v.cnv/Math.max(1,v.imp)) },
    {key: 'cnt', calc: (v) => 1, hide: true },
];

class ModData extends Listenable {
    constructor() {
        super();
        this._tags = null;
        this._campaigns = null;
        this._affs = null;
        this._records = null;

        this._tagList = null;
        this._tagmap = {};
        this._campaignList = null;

        this.tags = [];
        this.campaigns = [];
        this.scoremap = {};
    }

    // intersect two obj
	_jx(o1, o2) {
		let orr = {};
		Object.keys(o1).filter((v)=>o2[v]!==undefined).forEach((k) => {orr[k] = o1[k];});
		return orr;
    }
    
    _ux(o1, o2) {
        return Object.assign(o1, o2);
    }
    
    _uq(arr) {
        return arr.filter((e,i,ar) => ar.indexOf(e)==i);
    }

    listMetrics(includeHide) {
        if(includeHide) {
            return PREDEFINED_METRICS;
        } else {
            return PREDEFINED_METRICS.filter((v)=>!v.hide);
        }
    }

    listPredefinedCategories() {
        return PREDEFINED_CATEGORIES;
    }

    defaultMetric() {
        return PREDEFINED_METRICS[0];
    }

    defaultPeriodFrom() { return moment().add(-1, 'year'); }
    defaultPeriodTill() { return moment(); }

    dailymapOf(metric, campaigns) {
        let fn = metric.calc;
        let recs = {};


    }

    _qd(sc, q, qdiv) {
        return (sc[Math.floor((sc.length-1)*q/qdiv)] + sc[Math.ceil((sc.length-1)*q/qdiv)])/2;
    }

    _scores(scs) {
        // sort by default
        scs.sort();
        // run calcs
        let sum = scs.reduce((acc,sc) => acc += sc, 0);
        let avg = sum /Math.max(1, scs.length);
        let dev = scs.reduce((acc,sc) => acc += Math.pow(sc-avg, 2), 0)/Math.max(1, scs.length-1);

        let ret = {
            _raw: scs,
            cnt: scs.length,
            sum: sum,
            avg: avg,
            stdev: Math.sqrt(dev),
            med: this._qd(scs, 1, 2),
            q1: this._qd(scs, 1, 4),
            q3: this._qd(scs, 3, 4),
        };
        return ret;
    }

    tagScore(metric, tag, cids) {
        if(!cids)
            cids = Object.keys(this._campaigns);
        let fn = metric.calc;
        let scs = tag._c
            .filter((cid)=>0<=cids.indexOf(cid))
            .map((cid)=>this._campaigns[cid])
            .reduce((acc, c)=>acc.concat(c._r.map((r)=>fn(r))), []);
        return Object.assign(this._scores(scs), {m: metric.key});
    }

    dailyScores(metric, campaigns) {
        if(!campaigns)
            campaigns = this.campaigns;
            
        let fn = metric.calc;
        let daylogs = {};

        campaigns.forEach((c) => {
            c._r.forEach((r) => {
                let ds = r.d.toDate();
                if(!daylogs[ds]) daylogs[ds] = [fn(r)];
                else daylogs[ds].push(fn(r));
            });
        });

        Object.keys(daylogs).forEach((ds) => {
            daylogs[ds] = Object.assign(this._scores(daylogs[ds]), {m: metric.key});
        });
        // console.log(daylogs);
        return daylogs;
    }

    setTags(tags) {
        this._tags = tags;
        this._tagmap = {};
        this.tags = [];
        Object.keys(this._tags).forEach((t) => {
            let tag = this._tags[t];
            this.tags.push(this._tags[t]);
            if(!this._tagmap[tag.class])
                this._tagmap[tag.class] = [];
            this._tagmap[tag.class].push(tag);
        });

        this.trigger('tag');

        this.setAffiliation(this._affs);
    }


    setCampaigns(cdata) {
        this._campaigns = cdata.campaigns;
        this._records = cdata.records;
        // this._affs = cdata.affiliations;

        this._records.forEach((r) => {
            if(!this._campaigns[r.c]) return;
            r.d = moment(r.d);
            if(!this._campaigns[r.c]._r) this._campaigns[r.c]._r = [];
            this._campaigns[r.c]._r.push(r);
        });

        this.campaigns = [];
        Object.keys(this._campaigns).forEach((c) => {
            this._campaigns[c]._r = this._campaigns[c]._r.sort((l,r)=>l.d.isAfter(r.d));
            this.campaigns.push(this._campaigns[c]);
        });

        this.trigger('campaign');

        this.setAffiliation(cdata.affiliations);
    }

    filterByCampaignIds(cids) {
        this.campaigns = 
            this.campaigns.filter((c)=> 0<= cids.indexOf(c.id));
        this.tags = this.filteredTags(cids);
    }

    setAffiliation(affs) {       
        if(affs && this._tags && this._campaigns) {
            this._affs = affs;

            Object.keys(this._campaigns).forEach((c) => {
                this._campaigns[c]._t = [];
            });
            Object.keys(this._tags).forEach((t) => {
                this._tags[t]._c = [];
            });
            affs.forEach((a) => {
                if(this._campaigns[a.c] && this._tags[a.t]) {
                    this._campaigns[a.c]._t.push(a.t);
                    this._tags[a.t]._c.push(a.c);
                }
            });

            this.dailyScores(PREDEFINED_METRICS[3], this.campaigns);
            
            this.trigger('affiliation');
        }
    }

    filteredTags(cids) {
        let tids = this._uq(this._affs
            .filter((a)=> 0<=cids.indexOf(a.c))
            .map((a)=>a.t));
        return this.tags.filter((t) => 0<=tids.indexOf(t.id));
    }  

    filterExclude(cls, name) {
        if(!this._tagmap[cls] || this._tagmap[cls].length<=0) return;
        let exs = this._tagmap[cls].filter((tag)=>tag.name==name).map((tag)=>tag.id);
        return this.campaigns.filter(
            (c) => c._t.filter((tid) => 0<=exs.indexOf(tid)).length <= 0
        );
    }

    filterInclude(cls, name) {
        if(!this._tagmap[cls] || this._tagmap[cls].length<=0) return;
        let exs = this._tagmap[cls].filter((tag)=>tag.name==name).map((tag)=>tag.id);
        return this.campaigns.filter(
            (c) => c._t.filter((tid) => 0<=exs.indexOf(tid)).length > 0
        );
    }

    applyFilter(cids) {
        if(cids) {
            this.campaigns = cids.map((cid)=>this._campaigns[cid]);
        } else {
            this.campaigns = Object.keys(this._campaigns).map((cid) => this._campaigns[cid]);
        }
        this.tags = this.filteredTags(cids);
    }

    listTagClasses(includeTopmosts, includePredefineds) {
        let names = [];
        if(this.tags) {
            names = this._uq(this.tags
                .filter((t)=>TOPMOST_CATEGORIES.indexOf(t.class)<0)
                .map((t)=>t.class)
            );
        }
        else if(this._tagmap) {
            names = Object.keys(this._tagmap)
                .filter((c)=>TOPMOST_CATEGORIES.indexOf(c)<0);
        }

        if(includeTopmosts)
            names = TOPMOST_CATEGORIES.concat(names);

        if(includePredefineds)
            names = PREDEFINED_CATEGORIES.concat(names);

        return names;
    }

    listTopTagClasses(){
        return TOPMOST_CATEGORIES;
    }
    listPredTagClasses() {
        return PREDEFINED_CATEGORIES;
    }

    listTags(withinCls) {
        return this.tags.filter((t)=>t.class == withinCls);
    }

}
export default ModData;