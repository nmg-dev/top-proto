import axios from "axios";

const moment = require('moment');

const API_HOST = 'http://localhost:8080';
const GOOGLE_API_SCRIPT = 'https://apis.google.com/js/platform.js';
// const GOOGLE_API_KEY = '';
const GOOGLE_CLIENT_ID = '812043764419-lunbnv3g64rg709da2ad6asnqg05c7oi.apps.googleusercontent.com';


// storage keys
const KEY_UINFO = 'userinfo';
const KEY_METRIC = '_metric';
const KEY_PERIOD = '_period';
const KEY_FILTERS = '_filters';

const KEY_TAGS = 'tags';
const KEY_CAMPAIGNS = 'campaigns';
const KEY_AFFILIATIONS = 'affiliations';
const KEY_RECORDS = 'records';


export default {
    // metrics
    metrices: [
        { key: 'cpc', label: 'CPC', fn: (v) => (v.clk/Math.max(1.0, v.cost)), fmt: (v)=> `${v.toLocaleString()} 원`, ascending: true, desc: 'Cost Per Click', },
        { key: 'cpa', label: 'CPA', fn: (v) => (v.cnv/Math.max(1.0, v.cost)), fmt: (v)=> `${v.toLocaleString()} 원`, ascending: true, desc: 'Cost Per Action', },
        { key: 'ctr', label: 'CTR', fn: (v) => (v.clk/Math.max(1.0, v.imp)), fmt: (v)=> `${(100*v).toFixed(2)} %`, ascending: false, desc: 'Click Through Rate' },
        { key: 'cvr', label: 'CVR', fn: (v) => (v.cnv/Math.max(1.0, v.imp)), fmt: (v)=> `${(100*v).toFixed(2)} %`, ascending: false, desc: 'Conversion Rate' },
        { key: 'cnt', label: 'COUNT', fn: () => 1, fmt: (v)=> v.toLocaleString(), desc: 'Counts', defaultHide: true },
    ],
    // predefined classes
    presetCategoryCls: [
        { cls: 'category', label: '업종' },
        { cls: 'subcategory', label: '세부업종' },
    ],
    presetDesignCls : [
        { cls: 'design.layout', label: '레이아웃' },
        { cls: 'design.objet', label: '오브제' },
        { cls: 'design.background', label: '배경' },
        { cls: 'design.button', label: '버튼' },
    ],
    presetMessageCls : [
        { cls: 'content.keytopic', label: '주제' },
        { cls: 'content.keyword', label: '키워드' },
        { cls: 'content.trigger', label: '트리거' },
        { cls: 'content.adcopy', label: '카피' },
    ],

    html: function(tag, attrs) {
        let el = document.createElement(tag);
        Object.keys(attrs).forEach((ak) => {
            el.setAttribute(ak, attrs[ak]);
        });
        return el;
    },

    gauth: function(){
        let meta = this.html('meta', {
            name: 'google-signin-client_id',
            content: GOOGLE_CLIENT_ID,
        });
        document.head.appendChild(meta);
    
        let src = this.html('script', {
            async: '', defer: '',
            src: GOOGLE_API_SCRIPT,
        });
        // src.addEventListener('load', onGoogleApiScriptLoaded);
        document.head.appendChild(src);
    },

    authenticate: async function(gauth) {
        let resp = gauth.getAuthResponse();
        let profile = gauth.getBasicProfile();

        let authResp  = await axios.post(`${API_HOST}/auth`, {
            gid: profile.getId(),
            email: profile.getEmail(),
            token: resp.id_token,
        });
        this.setItem(KEY_UINFO, await authResp.data);

        // get default tags, campaigns
        this.retrieveTags(true);
        this.retrieveCampaigns(true);
    },

    hasItem: function(key) {
        return window.sessionStorage.getItem(key)!=null;
    },

    getItem: function(key) {
        let vals = window.sessionStorage.getItem(key);
        return vals ? JSON.parse(vals) : undefined;
    },

    setItem: function(key, value) {
        return window.sessionStorage.setItem(key, JSON.stringify(value));
    },

    getToken: function() {
        let uinfo = this.getItem(KEY_UINFO);
        return (uinfo && uinfo.id && uinfo.token) ? uinfo.token : null;
    },

    getMetric: function() {
        let m = this.getItem(KEY_METRIC);
        if(!m) {
            let defaultMetric = this.metrices[0].key;
            this.setMetric(defaultMetric);
            m = defaultMetric;
        }
        return this.metrices.filter((mk)=>mk.key===m)[0];
    },

    setMetric: function(mk) {
        let ms = this.metrices.filter((m)=>m.key===mk);
        if(ms && 0<ms.length)
            this.setItem(KEY_METRIC, mk);
    },

    dateformat: function(dt) {
        return moment(dt).format('YYYY-MM-DD');
        // let dd;
        // switch(typeof dt) {
        //     case 'string':
        //     case 'number': 
        //         dd = new Date(dt); break;
        //     case 'object':
        //     default:
        //         dd = dt; break;
        // }

        // let yy = dd.getFullYear();
        // let mm = dd.getMonth()+1;
        // mm = mm<10 ? `0${mm}` : mm.toFixed(0);
        // let d = dd.getDate();
        // d = d<10 ? `0${d}` : d.toFixed(0);
        // return `${yy}-${mm}-${d}`;
        
    },

    timeformat: function(dt) {
        return `${moment(dt).format('YYYY-MM-DD')}T00:00:00+09:00`;
        // return `${this.dateformat(dt)}T00:00:00+09:00`;
    },

    getPeriod: function() {
        let m = this.getItem(KEY_PERIOD);
        if(!m) {
            let _from = new Date();
            _from.setYear(_from.getFullYear()-3);
            let _till = new Date();
            let defaultPeriod = {
                from: Date.parse(_from.toLocaleDateString()),
                till: Date.parse(_till.toLocaleDateString()),
            };
            this.setPeriod(defaultPeriod);
            m = defaultPeriod;
        }
        return m;
    },

    setPeriod: function(period) {
        this.setItem(KEY_PERIOD, period);
    },

    getFilter: function() {
        return this.getItem(KEY_FILTERS);
    },

    addFilter: function(tagId) {
        let tags = this.retrieveTags();
        let currentFilter = this.getFilter() || [];
        let theTag = tags[tagId];
        if(!theTag) return;
        if(0<currentFilter.filter((cf)=>cf.id===tagId).length) return;
        
        currentFilter.push(theTag);
        this.setItem(KEY_FILTERS, currentFilter);
    },

    delFilter: function(tagId) {
        let tags = this.retrieveTags();
        let currentFilter = this.getFilter() || {};
        let theTag = tags[tagId];
        if(!theTag) return;

        currentFilter = currentFilter.filter((cf)=>cf.id!=tagId);
        this.setItem(KEY_FILTERS, currentFilter);
    },

    getPresetCategoryClasses: function() {
        return this.presetCategoryCls.map((c)=>c.cls);
    },

    getPresetDesignClasses: function() {
        return this.presetDesignCls.map((c)=>c.cls);
    },

    getPresetMessageClasses: function() {
        return this.presetMessageCls.map((c)=>c.cls);
    },

    getPresetVisualClasses: function() {
        return []
            .concat(this.getPresetDesignClasses())
            .concat(this.getPresetMessageClasses());
    },

    // retrieve tag data from server
    retrieveTags: function(overwrite) {
        if(overwrite || !this.hasItem(KEY_TAGS)) {
            (async() => {
                window.console.log(' -- retrieve tags');
                let resp = await axios.get(`${API_HOST}/t/`);
                this.setItem(KEY_TAGS, await resp.data);
            })();
        }
        return this.getItem(KEY_TAGS);
    },

    //
    refreshUpdateValues: function(tags, campaigns, records, affiliations) {
        let period = this.getPeriod();
        let metric = this.getMetric();
        // parse and load campaign records
        records = records.map((rec)=> {
            return {
                id: rec.id, 
                c: rec.c, 
                imp: rec.imp, 
                clk: rec.clk, 
                cnv: rec.cnv, 
                cost: rec.cost,
                d: Date.parse(rec.d.replace(/T.+$/i, '')),
                v: metric.fn(rec),
            };
        });
        this.setItem(KEY_RECORDS, records);


        // parse and load campaigns
        Object.keys(campaigns).forEach((cid) => {
            let ctags = affiliations
                .filter((aff)=>aff.c == cid)
                .reduce((agg,aff) => {
                    if(agg.indexOf(aff.t)<0)
                        agg.push(aff.t);
                    return agg;
                }, []);
            let crecords = records.filter((rec)=>rec.c==cid && period.from <= rec.d && rec.d <= period.till);
            let summary = crecords.reduce((agg,rec) => {
                agg.sum += rec.v;
                agg.cnt += 1;
                agg.stdev += rec.v**2;
                return agg;
            }, { sum: 0, cnt: 0, stdev: 0, });
            summary.avg = summary.sum / Math.max(1.0, summary.cnt);
            summary.stdev = summary.stdev/summary.cnt - summary.avg**2;
            campaigns[cid] = Object.assign(campaigns[cid], {
                tags: ctags,
                summary: summary,
                records: crecords,
            });
        });

        // update tag info
        Object.keys(tags).forEach((tid) => {
            tags[tid].campaigns = affiliations.filter((aff) => aff.t == tid)
                .reduce((agg, aff) => {
                    if(agg.indexOf(aff.c) < 0)
                        agg.push(aff.c);
                    return agg;
                }, []);
        });
        this.setItem(KEY_TAGS, tags);

        this.setItem(KEY_CAMPAIGNS, campaigns);
        
        this.setItem(KEY_AFFILIATIONS, affiliations);

        window.console.log(' -- data refreshed');
    },

    // retrieve campaign data from server
    retrieveCampaigns: function(overwrite) {
        if(overwrite || !this.hasItem(KEY_CAMPAIGNS)) {
            (async() => {
                let tags = this.retrieveTags(overwrite);
                let period = this.getPeriod();
                let resp = await axios.post(`${API_HOST}/c/`, {
                    from: this.timeformat(period.from), 
                    till: this.timeformat(period.till),
                });
                let cdata = await resp.data;
                let records = cdata.records;
                let campaigns = cdata.campaigns;
                let affiliations = cdata.affiliations;
                
                this.refreshUpdateValues(tags, campaigns, records, affiliations);
            })();
        }
        return this.getItem(KEY_CAMPAIGNS);
    },

    filterCampaignIds: function(filters) {
        let campaigns = this.retrieveCampaigns();
        let tags = this.retrieveTags();
        let cids = Object.keys(campaigns).map((cid)=>parseInt(cid));
        if(filters) {
            Object.keys(filters).forEach((cls) => {
                let positiveFilter = filters[cls].reduce((agg, tid) => {
                    return agg.concat(tags[tid].campaigns.filter((cid)=> agg.indexOf(cid)<0));
                }, []);
                cids = cids.filter((cid)=> 0<=positiveFilter.indexOf(cid));
            });
        }
        return cids;
    },

    bestPracticeOver: function(filters) {
        // load campaign data first
        let campaigns = this.retrieveCampaigns();
        let tags = this.retrieveTags();
        // tags to array
        tags = Object.keys(tags).map((tid) => tags[tid]);
        

        // filter campaigns to put
        let cids = this.filterCampaignIds(filters);

        // metric
        let metric = this.getMetric();
        
        // load tag values
        return this.getPresetVisualClasses().reduce((agg, cls) => {
            // filter tags
            agg[cls] = tags
                .filter((tag) => tag.class == cls)
                .filter((tag) => !filters || !filters[cls] || 0<=filters[cls].indexOf(tag.id))
                .reduce((acc, tag) => {
                    // filter campaign ids
                    let tcids = tag.campaigns.filter((cid) => 0<=cids.indexOf(cid));
                    // average
                    acc.push({
                        t: tag,
                        v: tcids.reduce((sum, cid) => sum + campaigns[cid].summary.avg, 0) / Math.max(1.0, tcids.length),
                    });
                    return acc;
                }, [])
                .sort((l,r) => (metric.ascending ? -1 : 1) * r.v - l.v);
            return agg;
        }, {});
    },

    topOptionOverPractice: function(practices) {
        Object.keys(practices).forEach((cls) => {
            let ov = practices[cls];
            try {
                practices[cls] = ov[0].t.name;
            } catch {
                practices[cls] = undefined;
            }
        });
        return practices;
    },

    getTagsWithinClass: function(cls) {
        let tags = this.retrieveTags();
        let rets = Object.keys(tags)
            // .map((tid)=>parseInt(tid))
            .filter((tid) => tags[tid].class == cls)
            .map((tid) => tags[tid]);
        return rets;
    },

    _classReferences: function(best, clss) {
        return clss.map((cls) => {
            return {
                cls,
                name: best[cls] && 0<best[cls].length ? best[cls][0].t.name : ''
            };
        });
    },

    getPeriodRanges(period) {
        let days = (period.till - period.from) / 86400000;
        // let inc = 86400000;
        let radix = '';
        let fmt;
        // daily (0 ~ 32d); 0 to 32 points
        if(days <= 32) {
            radix = 'day';
            fmt = (dt) => moment(dt).format('YYYY-MM-DD');
        } 
        // weekly (33 ~ 180d); 5 to 24 points
        else if(days <= 180) {
            radix = 'week';
            fmt = (dt) => moment(dt).format('YYYY [week]WW');
        }
        // monthly (181 ~ 730d); 6 to 24 points
        else if(days <= 730) {
            radix = 'month';
            fmt = (dt) => moment(dt).format('MMM.YYYY');
        }
        // quarterly (731 ~ 1461d); 8 to 16 points
        else if(days <= 1461) {
            radix = 'quarter';
            fmt = (dt) => moment(dt).format('YYYY.[Q]Q');
        }
        // yearly; 4 to ~ points
        else {
            radix = 'year';
            fmt = (dt) => (new Date(dt).getFullYear()).toString();
        }

        let labels = [];
        let dc = moment(period.from);
        let dt = moment(period.till);
        do {
            labels.push(fmt(dc));
            dc = dc.add(1, radix);
        } while(dc.isBefore(dt));

        // append last if not exists
        let _last = fmt(dt);
        if(labels.indexOf(_last)<0) labels.push(_last);
        return {
            labels,
            radix,
            fmt,
        };
    },

    dashboardSeries: function() {
        let filters = this.getFilter();
        let prange = this.getPeriodRanges(this.getPeriod());

        let cids = this.filterCampaignIds(filters);
        let series = new Array(prange.length);
        // iterate records
        this.getItem(KEY_RECORDS)
            .filter((rec)=> 0<=cids.indexOf(rec.c))
            .forEach((rec) => {
                let label = prange.fmt(rec.d);
                let didx = prange.labels.indexOf(label);
                if(!series[didx])
                    series[didx] = [];
                series[didx].push(rec.v);
            });
        return prange.labels.map((label,sidx) => {
            let s = series[sidx];
            if(s && 0<s.length) {
                let total = s.reduce((t,sv) => t+sv, 0); 
                return {
                    label,
                    total,
                    value: total / Math.max(1.0, s.length),
                };
            } else {
                return {
                    label,
                    total: 0,
                    value: 0,
                };
            }
        });
    },

    dashboardDesignRefers: function(best) {
        return this._classReferences(best, this.getPresetDesignClasses());
    },
    dashboardMessageRefers: function(best) {
        return this._classReferences(best, this.getPresetMessageClasses());
    },

    dashboardPreviews: function() {
        let filters = this.getFilter();
        let campaigns = this.retrieveCampaigns();
        let cids = this.filterCampaignIds(filters);
        let metric = this.getMetric();
        let ctags = this.getTagsWithinClass('category');
        return ctags.reduce((agg, tag) => {
            let title = tag.name;
            let cmps = tag.campaigns
                .filter((cid)=> 0<=cids.indexOf(cid))
                .map((cid) => campaigns[cid]);
            let bests = this.bestPracticeOver(Object.assign(filters || {}, {category: [tag.id]}));
            let cvs = cmps.map((cmp) => cmp.summary.avg);                
            agg.push({
                title,
                options: this.topOptionOverPractice(bests),
                average: metric.fmt(cvs.reduce((t, cv) => t+cv, 0) / Math.max(1.0, cvs.length)),
            });
            return agg;
        }, []);
    },
    creativeCombinations: function(counts) {
        let filters = this.getFilter();
        let best = this.bestPracticeOver(filters);
        let combinations = [];

        for(let i=0; i<counts; i++) {
            let combi = Object.keys(best).reduce((agg, cls) => {
                if(i<best[cls].length)
                    agg[cls] = best[cls][i].t.name;
                else if(0<best[cls].length)
                    agg[cls] = best[cls][best[cls].length-1];
                else
                    agg[cls] = undefined;
                return agg;   
            }, {});
            combinations.push(combi);
        }
        return combinations;
    },
    creativeSummaryCharts: function(counts) {
        let clss = this.getPresetVisualClasses();
        let filter = this.getFilter();
        let campaigns = this.retrieveCampaigns();
        let metric = this.getMetric();
        return clss.map((cls) => {
            let ctags = this.getTagsWithinClass(cls)
                .filter((tag) => !filter || !filter[tag.class] || 0<=filter[tag.class].indexOf(tag.id));
            // 
            if(counts < ctags.length)
                ctags = ctags.slice(0, counts);
            let data = [];
            ctags.forEach((tag) => {
                let cids = tag.campaigns;
                let mean = cids.reduce((total, cid) => {
                    return total + campaigns[cid].summary.avg / Math.max(1.0, cids.length);
                });
                data.push({
                    tag,
                    cids,
                    mean,
                });
            });
            data.sort((l,r) => (metric.ascending ? -1 : 1) * r.mean - l.mean);

            return {
                cls,
                data,
            };
        });
    },
    creativeDetailChart: function() {

    },


};