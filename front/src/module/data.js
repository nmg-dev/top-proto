import moment from 'moment';
import Listenable from './listenable';

const PREDEFINED_CATEGORIES = ['category', 'goal', 'channel', 'media'];
const TOPMOST_CATEGORIES = ['layout', 'background', 'objet', 'lead'];
const PREDEFINED_METRICS = [
    {key: 'cpc', calc: (v) => (v.clk/Math.max(1,v.cost)), fmt: (v)=> v.toLocaleString()+ 'KRW' },
    {key: 'cpa', calc: (v) => (v.cnv/Math.max(1,v.cost)), fmt: (v)=> v.toLocaleString()+ 'KRW' },
    {key: 'ctr', calc: (v) => (v.clk/Math.max(1,v.imp)), fmt: (v) => (100*v).toFixed(4)+' %' },
    {key: 'cvr', calc: (v) => (v.cnv/Math.max(1,v.imp)), fmt: (v) => (100*v).toFixed(4)+' %' },
    {key: 'cnt', calc: (v) => 1, hide: true, fmt: (v)=> v.toLocaleString()+ '.' },
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

    defaultPeriodFrom() { return moment().add(-1, 'year'); }
    defaultPeriodTill() { return moment(); }


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
        let fn = metric.calc;
        let scs = tag._c
            .filter((cid)=>!cids || cids.length<=0 || 0<=cids.indexOf(cid))
            .map((cid)=>this._campaigns[cid])
            .reduce((acc, c)=>acc.concat(c._r.map((r)=>fn(r))), []);
        
        let scores = this._scores(scs);
        

        return Object.assign(scores, {m: metric.key});
    }

    categoryScore(metric, cls, cids) {
        let fn = metric.calc;
        let rs = [];
        this.listTags(cls).forEach((t) => {
            rs = rs.concat(
                t._c.filter((cid)=>!cids || cids.length<=0 || 0<cids.indexOf(cid))
                    .map((cid)=>this._campaigns[cid])
                    .reduce((r, c) => r.concat(c._r.map((r)=>fn(r))), [])
            );
        });
        return Object.assign(this._scores(rs), {m: metric.key});
    }

    plotClassbars(metric, cls, cids, tids) {
        let cScore = this.categoryScore(metric, cls, cids);
        let tags = this.listTags(cls).map((t)=>t.id)
            .filter((tid)=>!tids || tids.length<=0 || 0<=tids.indexOf(tid));
        let tScores = {};
        let ts = tags;
        let tnames = {};
        tags.forEach((tid) => { 
            tnames[tid] = this._tags[tid].name;
            tScores[tid] = this.tagScore(metric, this._tags[tid]);
        });
        ts = ts.sort((l,r)=>tScores[l].avg-tScores[r].avg);
        
        return {
            d: [
                // tag scores
                {
                    name: cls,
                    x: ts,
                    y: ts.map((tn)=>tScores[tn].avg),
                    // error_y: {type: 'data', array: ts.map((tn)=>tScores[tn].stdev), visible: true},
                    type: 'bar'
                },
                // category average
                {
                    name: 'AVG.',
                    x: ts,
                    y: ts.map(()=>cScore.avg),
                    // error_y: {type:'data', array: ts.map(()=>cScore.stdev), visible: true},
                    type: 'scatter+line'
                },
                // category median
                {
                    name: 'MEDIAN',
                    x: ts,
                    y: ts.map(()=>cScore.med),
                    type: 'scatter+line'
                }
            ],
            l: {
                autosize: true, 
                showlegend: false,
                xaxis: { showticklabels: true, tickvals: ts, ticktext: ts.map((tn)=>tnames[tn]) },
                yaxis: { zeroline: false, ticks: '', showticklabels: false },
                bargap: 0.1,
            }
        }
    }

    plotTimeSeries(metric) {
        let fn = metric.calc;
        let values = {};

        this.campaigns.forEach((c) => {
            c._r.forEach((r)=> {
                let dk = r.d.format('YYYY-MM-DD');
                let dv = fn(r);
                if(!values[dk]) values[dk] = [dv];
                else values[dk].push(dv);
            })
        });

        let days = Object.keys(values).sort();
        let scores = days.map((d)=>
            values[d].reduce((sum, v)=>sum+=v, 0)/Math.max(1, values[d].length)
        );
        let total = days.reduce((acc, d) => acc += values[d].reduce((sum, v)=>sum+=v, 0), 0);
        let cnts = days.reduce((acc, d)=> acc += values[d].length, 0);

        return [{
            name: metric.key,
            x: days,
            y: scores,
            type: 'bar',
        }, {
            name: 'average',
            x: days,
            y: days.map(()=>total/Math.max(1, cnts)),
            type: 'scatter+line',
        }]
    }

    bestRecommandWith(tag, metric) {
        let cids = this.campaigns
            .filter((c)=> 0<=tag._c.indexOf(c.id))
            .map((c)=>c.id);

        let scores = {_title: tag.name};
        this.listTopTagClasses().forEach((cls) => {
            let m = null;
            this.listTags(cls).forEach((t) => {
                let s = this.tagScore(metric, t, cids);
                if(m==null || m.avg < s.avg) {
                    let cs = t._c
                        .filter((cid)=>0<=cids.indexOf(cid))
                        .sort((l,r)=>r.id-l.id)
                        .map((cid)=>this._campaigns[cid]).pop();

                    m = Object.assign(s, {tid: t.id, name: t.name, sample: cs ? cs.asset : ''});
                }
            });
            m.value = metric.fmt(m.avg);
            scores[cls] = m;
        });
        return scores;

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
        return daylogs;
    }

    getTag(tid) { return this._tags[tid]; }
    getCampaign(cid) { return this._campaigns[cid]; }

    hasTagId(tid) { return this.tags.reduce((acc,t)=>acc || t.id==tid, false); }
    hasCampaignId(cid) { return this.campaigns.reduce((acc,c)=>acc || c.id==cid, false); }

    initTags() {
        this._tagmap = {};
        this.tags = [];
        Object.keys(this._tags).forEach((t) => {
            let tag = this._tags[t];
            this.tags.push(this._tags[t]);
            if(!this._tagmap[tag.class])
                this._tagmap[tag.class] = [];
            this._tagmap[tag.class].push(tag);
        });
    }

    setTags(tags) {
        this._tags = tags;
        this.initTags();

        this.trigger('tag');

        this.setAffiliation(this._affs);
    }

    initCampaigns() {
        this.campaigns = Object.keys(this._campaigns)
            .map((cid)=>this._campaigns[cid]);
        // .reduce((acc, cid) => {
        //     this._campaigns[cid]._r = this._campaigns[cid]._r.sort((l,r)=>l.d.isAfter(r.d));
        //     // this.campaigns.push(this._campaigns[c]);
        //     acc.push(this._campaigns[])
        // }, []);
        // 
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

        this.initCampaigns();
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

            this.initTags();

            this.dailyScores(PREDEFINED_METRICS[3], this.campaigns);
            
            this.trigger('affiliation');
        }
    }

    filteredTags(cids) {
        if(!this._affs) return;
        let tids = this._uq(this._affs
            .filter((a)=> 0<=cids.indexOf(a.c))
            .map((a)=>a.t));
        this.initTags();
        return this.tags.filter((t) => 0<=tids.indexOf(t.id));
    }  

    filterExclude(cls, name) {
        if(!this._tagmap[cls] || this._tagmap[cls].length<=0) return;
        let exs = this._tagmap[cls].filter((tag)=>tag.name==name).map((tag)=>tag.id);
        this.initCampaigns();
        return this.campaigns.filter(
            (c) => c._t.filter((tid) => 0<=exs.indexOf(tid)).length <= 0
        ).map((c)=>c.id);
    }

    filterInclude(cls, name) {
        if(!this._tagmap[cls] || this._tagmap[cls].length<=0) return;
        let exs = this._tagmap[cls].filter((tag)=>tag.name==name).map((tag)=>tag.id);
        this.initCampaigns();
        return this.campaigns.filter(
            (c) => exs.reduce((acc,tid)=>acc = acc || 0<=c._t.indexOf(tid), false)
        ).map((c)=>c.id);
    }

    applyFilter(cids) {
        if(cids) {
            this.campaigns = cids.map((cid)=>this._campaigns[cid]);
        } else {
            this.initCampaigns();
            // this.campaigns = Object.keys(this._campaigns).map((cid) => this._campaigns[cid]);
        }
        this.tags = this.filteredTags(cids);

        this.trigger('affiliation');
    }

    listTagClasses(includeTopmosts, includePredefineds, excludeTags) {
        let names = [];
        if(!excludeTags) {
            if(this.tags) {
                names = this._uq(this.tags
                    .filter((t)=>TOPMOST_CATEGORIES.indexOf(t.class)<0 && PREDEFINED_CATEGORIES.indexOf(t.class)<0)
                    .map((t)=>t.class)
                );
            }
            else if(this._tagmap) {
                names = Object.keys(this._tagmap)
                    .filter((c)=>TOPMOST_CATEGORIES.indexOf(c)<0);
            }
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

    listTagOptions(withinCls, lang='ko') {
        return this.listTags(withinCls)
            .map((tag) => {
                return {
                    value: tag.id,
                    label: tag.property && tag.property[lang] ? tag.property[lang] : tag.name
                };
            });
    }

}
export default ModData;