import moment from 'moment';
import Listenable from './listenable';
import Metric from './metric';
import App from '../App';

const CLS_KEY_DELIMITER = '|';

class ModData extends Listenable {
    constructor() {
        super();
        this._tags = null;
        this._campaigns = null;
        this._affs = null;
        this._records = null;
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

    initTags() {
        this.tags = [];
        Object.keys(this._tags).forEach((t) => {
            let tag = this._tags[t];
            this.tags.push(this._tags[t]);
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
    }

    setCampaigns(cdata) {
        this._campaigns = cdata.campaigns;
        this._records = cdata.records;
        // this._affs = cdata.affiliations;

        Object.keys(this._campaigns).forEach((cid)=>{
            this._campaigns[cid]._r = [];
        });

        this._records.forEach((r) => {
            if(!this._campaigns[r.c]) return;
            r.d = moment(r.d);
            this._campaigns[r.c]._r.push(r);
        });

        this.initCampaigns();
        this.trigger('campaign');

        this.setAffiliation(cdata.affiliations);
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

            // this.dailyScores(Metric.ByKey(App.kpi), this.campaigns);
            
            this.trigger('affiliation');
        }
    }

    setMetric(metric_key) {
        let metric = Metric.ByKey(metric_key);
        this._records
            .filter((rec)=>rec[metric_key]==null)
            .forEach((rec,ridx)=>{
                let val = metric.value(rec);
                this._records[ridx][metric_key] = val;
            });

        this.trigger('metric');
    }

    retrieveScores(metric_key, campaign_ids, period_from, period_till) {
        // this.setMetric(metric_key);
        // let scores = [];
        let metric = Metric.ByKey(metric_key);
        if(!campaign_ids)
            campaign_ids = Object.keys(this._campaigns);
        
        let values = campaign_ids
            .map((cid)=>this._campaigns[cid])
            .reduce((scores, campaign) => {
                campaign._r
                    .filter((rec)=>!(period_from && rec.d.isBefore(period_from)))
                    .filter((rec)=>!(period_till && rec.d.isAfter(period_till)))
                    .forEach((rec)=>{
                        if(!rec[metric_key])
                            rec[metric_key] = metric.value(rec);
                        scores.push(rec[metric_key]);
                    });
                return scores;
            }, []);

        return this._scores(values);
    }

    retrieveBestElement(cls, metric_key, campaign_ids, period_from, period_till) {
        return this.listTags(cls)
            .reduce((best, tag) =>{
                let score = this.retrieveScores(
                    metric_key, 
                    tag._c.filter((cid)=>!campaign_ids || 0<=campaign_ids.indexOf(cid)),
                    period_from,
                    period_till);

                if(!best || best.scores.avg < score.avg) {
                    best = Object.assign(tag, {scores: score});
                }
                return best;
            });
        // this._tagmap[cls].forEach()
    }

    retrieveClassScores(cls, metric_key, campaign_ids, period_from, period_till) {
        let scores = this.listTags(cls)
            .reduce((rs, tag) =>{
                let score = this.retrieveScores(
                    metric_key, 
                    tag._c.filter((cid)=>!campaign_ids || 0<=campaign_ids.indexOf(cid)),
                    period_from,
                    period_till);
                rs.push(Object.assign(tag, {scores: score}));
            }, []);

        scores.sort((l,r)=>l.scores.avg-r.scores.avg);
        return scores;
    }

    _getCampaignCombinationKey(campaign, clss) {
        let cks = [];
        campaign._t.forEach((tid)=>{
            let ckidx = clss.indexOf(this._tags[tid].class);
            if(0<=ckidx)
                cks[ckidx] = tid;
        });

        // fill gaps
        cks.forEach((ck,ci)=>{if(!ck) cks[ci]='';});
        return cks.join(CLS_KEY_DELIMITER);
    }
    retrieveTopCombinations(clss, metric_key, campaign_ids, period_from, period_till, limits) {
        if(!campaign_ids) campaign_ids = Object.keys(this._campaigns).map((cid)=>parseInt(cid));

        //
        let combiScores = campaign_ids.map((cid)=>this._campaigns[cid])
            .reduce((rs, campaign)=>{
                let ck = this._getCampaignCombinationKey(campaign, clss);
                if(!rs[ck])
                    rs[ck] = [];
                rs[ck].push(campaign.id);
                return rs;
        }, {});

        let rs = [];
        Object.keys(combiScores).forEach((ci) => {
            let combi = ci.split(CLS_KEY_DELIMITER).reduce((acc,cii)=>{
                let tid = parseInt(cii);
                let tag = this._tags[tid];
                if(!tag) return acc;

                acc[tag.class] = tag;
                return acc;
            }, {});
            let score = this.retrieveScores(metric_key, combiScores[ci], period_from, period_till);
            rs.push({
                c: combi,
                s: score
            });
        });

        rs = rs.sort((l,r)=>r.s.avg-l.s.avg);
        return (!limits || limits<=1) ? rs[0] : rs.splice(0, limits);
    }

    retrieveTimelines(period_fmt, metric_key, campaign_ids, period_from, period_till) {
        let metric = Metric.ByKey(metric_key);
        let rss = this._records
            .filter((rec)=>!campaign_ids || 0<=campaign_ids.indexOf(rec.c))
            .filter((rec)=>!period_from || period_from.isBefore(rec.d))
            .filter((rec)=>!period_till || period_till.isAfter(rec.d))
            .reduce((rs, rec)=>{
                let dk = period_fmt(rec.d);
                if(!rs[dk]) {
                    rs[dk] = [];
                }
                rs[dk].push(metric.value(rec));
                return rs;
            }, {});

        return Object.keys(rss).sort().map((dk)=>{
            return Object.assign({d: dk}, this._scores(rss[dk]));
        });
    }

    listTags(withinCls) {
        return Object.keys(this._tags).map((tid)=>this._tags[parseInt(tid)])
            .filter((tag)=>tag.class===withinCls);
    }

    listSiblingTags(tagId) {
        let cls = this._tags[tagId].class;
        return Object.keys(this._tags)
            .map((tid)=>parseInt(tid))
            .filter((tid)=>this._tags[tid].class==cls && tid!=tagId);
    }

    listCampaignIds(withTagIds) {
        if(withTagIds && 0<withTagIds.length) {
            // this._tags
            let cids = withTagIds.map((tid)=>this._tags[tid])
                .reduce((cs, tag)=>{
                    // cs = cs.concat(tag._c.filter((cid)=>cs.indexOf(cid)<0));
                    if(cs.length<=0) 
                        cs = tag._c;
                    else 
                        cs = cs.filter((cid)=>0<=tag._c.indexOf(cid));
                    return cs;
                }, [])
            return cids;
        } else {
            return Object.keys(this._campaigns);
        }
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