import axios from "axios";

const moment = require('moment');

const API_HOST = 0<=window.location.hostname.indexOf('localhost') ? 'http://localhost:8080' : '';
const GOOGLE_API_SCRIPT = 'https://apis.google.com/js/platform.js';
// const GOOGLE_API_KEY = '';
const GOOGLE_CLIENT_ID = '812043764419-lunbnv3g64rg709da2ad6asnqg05c7oi.apps.googleusercontent.com';

const DEFAULT_PERIOD_FROM = Date.parse('2017-05-01');

// storage keys
const KEY_UINFO = 'userinfo';
const KEY_METRIC = '_metric';
const KEY_PERIOD = '_period';
const KEY_FILTERS = '_filters';

const KEY_TAGS = 'tags';
const KEY_CAMPAIGNS = 'campaigns';
const KEY_AFFILIATIONS = 'affiliations';
const KEY_RECORDS = 'records';
const KEY_LATEST_UPDATED = '_last_updated';

const KEY_LOCK_CAMPAIGNS = '_lock.campaigns';
const KEY_LOCK_TAGS = '_lock.tags';
const KEY_LOCK_UPDATES = '_lock.updates';

const QUERY_MID_CLASSES = [
    'category', 'media', 'admedia', 'goal'
];

const NUMBER_FORMATTER = function(suffix, multiplier, radix) {
    let s = suffix;
    let m = multiplier || 1;
    let r = 10.0**radix;
    return function(v) {
        let n = Math.round(r*m*v) / r;
        return `${n.toLocaleString()} ${s}`;
    }
};

export default {
    // metrics
    metrices: [
        { key: 'cpc', label: 'CPC', fn: (v) => (v.clk/Math.max(1.0, v.cost)), fmt: NUMBER_FORMATTER('원', 1, 0), chart_fmt: '#,###원', ascending: true, desc: 'Cost Per Click', },
        { key: 'cpa', label: 'CPA', fn: (v) => (v.cnv/Math.max(1.0, v.cost)), fmt: NUMBER_FORMATTER('원', 1, 0), chart_fmt: '#,###원', ascending: true, desc: 'Cost Per Action', },
        { key: 'ctr', label: 'CTR', fn: (v) => (v.clk/Math.max(1.0, v.imp)), fmt: NUMBER_FORMATTER('%', 100, 2), chart_fmt: '#,###%', ascending: false, desc: 'Click Through Rate' },
        { key: 'cvr', label: 'CVR', fn: (v) => (v.cnv/Math.max(1.0, v.imp)), fmt: NUMBER_FORMATTER('%', 100, 2), chart_fmt: '#,###%', ascending: false, desc: 'Conversion Rate' },
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
        { cls: 'content.keyword', label: '키워드' },
        { cls: 'content.trigger', label: '트리거' },
        { cls: 'content.adcopy', label: '카피' },
        { cls: 'content.benefit', label: '혜택' },
    ],
    checkup_keys: [
        {k: KEY_UINFO, l: 'authenticate'},
        {k: KEY_TAGS, l: 'loading_tags'},
        {k: KEY_CAMPAIGNS, l: 'loading_campaigns'},
        {k: KEY_RECORDS, l: 'processing_records'},
        {k: KEY_AFFILIATIONS, l: 'computing_affiliations'},
        {k: KEY_LATEST_UPDATED, l: 'latest_updated'},
    ],
    querymid_classes: QUERY_MID_CLASSES,

    html: function(tag, attrs) {
        let el = document.createElement(tag);
        if(attrs) {
            Object.keys(attrs).forEach((ak) => {
                el.setAttribute(ak, attrs[ak]);
            });
        }
        return el;
    },

    gtm: function(containerId) {
        let el = this.html('script');
        el.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${containerId}');`;
        document.head.appendChild(el);
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

    loading_check: function() {
        return this.checkup_keys.map((ck) => Object.assign({f: this.hasItem(ck.k)}, ck));
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
        // this.retrieveTags(true);
        // this.retrieveCampaigns(true);
    },

    hasItem: function(key) {
        return window.sessionStorage.getItem(key)!=null;
    },

    hasUpdated: function() {
        return this.hasItem(KEY_RECORDS) && this.hasItem(KEY_AFFILIATIONS);
    },

    hasRetrieved: function() {
        return this.hasItem(KEY_TAGS) && this.hasItem(KEY_CAMPAIGNS);
    },

    getItem: function(key) {
        let vals = window.sessionStorage.getItem(key);
        return vals ? JSON.parse(vals) : undefined;
    },

    setItem: function(key, value) {
        return window.sessionStorage.setItem(key, JSON.stringify(value));
    },

    delItem: function(key) {
        if(window.sessionStorage[key]!==undefined) {
            window.sessionStorage.removeItem(key);
        }
    },

    getUser: function() {
        return this.getItem(KEY_UINFO);
    },

    getToken: function() {
        let uinfo = this.getItem(KEY_UINFO);
        return (uinfo && uinfo.id && uinfo.token) ? uinfo.token : null;
    },

    getMetric: function(mk) {
        let m = mk || this.getItem(KEY_METRIC);
        if(!m) {
            let defaultMetric = this.metrices[0].key;
            this.setMetric(defaultMetric);
            m = defaultMetric;
        }
        return this.metrices.filter((mk)=>mk.key===m)[0];
    },

    setMetric: function(mk) {
        let ms = this.metrices.filter((m)=>m.key===mk);
        if(ms && 0<ms.length && mk!=this.getItem(KEY_METRIC)) {
            this.setItem(KEY_METRIC, mk);
            this.refreshUpdateValues(
                this.retrieveTags(),
                this.retrieveCampaigns(),
                this.getItem(KEY_RECORDS),
                this.getItem(KEY_AFFILIATIONS));
        }
    },

    dateformat: function(dt) {
        return moment(dt).format('YYYY-MM-DD');
    },

    timeformat: function(dt) {
        return `${moment(dt).format('YYYY-MM-DD')}T00:00:00+09:00`;
    },

    getPeriod: function() {
        let m = this.getItem(KEY_PERIOD);
        if(!m) {
            let _from = new Date(DEFAULT_PERIOD_FROM);
            // _from.setYear(_from.getFullYear()-3);
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
        let currentFilter = this.getFilter() || {};
        tagId = parseInt(tagId);
        let theTag = tags[tagId];

        if(!theTag) return false;
        // if(0<currentFilter.filter((cf)=>cf.id===tagId).length) return;
        if(!currentFilter[theTag.class])
            currentFilter[theTag.class] = [tagId];
        else if(currentFilter[theTag.class].indexOf(tagId)<0)
            currentFilter[theTag.class].push(tagId);
        else
            return false;
        
        this.setItem(KEY_FILTERS, currentFilter);
        return true;
    },

    delFilter: function(tagId) {
        let tags = this.retrieveTags();
        let currentFilter = this.getFilter();
        let theTag = tags[tagId];
        tagId = parseInt(tagId);

        if(!theTag || !currentFilter 
        || !currentFilter[theTag.class] || !currentFilter[theTag.class].indexOf(tagId)<0) 
            return false;

        currentFilter[theTag.class] = currentFilter[theTag.class].filter((tid)=>tid!=tagId);
        // null out
        if(currentFilter[theTag.class].length<=0)
            delete currentFilter[theTag.class];

        this.setItem(KEY_FILTERS, currentFilter);
        return true;
    },

    resetFilter: function(cls) {
        let currentFilter = this.getFilter();
        if(currentFilter[cls]) {
            delete currentFilter[cls]
            this.setItem(KEY_FILTERS, currentFilter);
            return true;
        } else {
            return false;
        }

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
        // nothing without access
        if(!this.hasItem(KEY_UINFO)) return [];
        if(overwrite || !this.hasItem(KEY_TAGS)) {
            // 
            if(this.hasItem(KEY_LOCK_TAGS)) return;
            this.setItem(KEY_LOCK_TAGS, Date.now());

            this.delItem(KEY_LATEST_UPDATED);
            window.dataLayer.push({ event: 'tagop.api.tags' });
            (async() => {
                let resp = await axios.get(`${API_HOST}/t/`);
                this.setItem(KEY_TAGS, await resp.data);

                // release lock
                this.delItem(KEY_LOCK_TAGS);
            })();
        }
        return this.getItem(KEY_TAGS);
    },

    retrieveRecords: function() {
        return this.getItem(KEY_RECORDS);
    },

    retrieveAffiliations: function() {
        return this.getItem(KEY_AFFILIATIONS);
    },

    updateValues: function() {
        this.refreshUpdateValues(
            this.retrieveTags(),
            this.retrieveCampaigns(),
            this.retrieveRecords(),
            this.retrieveAffiliations()
        );
    },

    //
    refreshUpdateValues: function(tags, campaigns, records, affiliations) {
        if(!records || !affiliations || !tags || !campaigns)
            return;
        if(this.hasItem(KEY_LOCK_UPDATES)
        && parseInt(this.getItem(KEY_LOCK_TAGS))>Date.now()-900)
            return;
        this.setItem(KEY_LOCK_UPDATES, Date.now());


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
                d: typeof(rec.d)=='string' ? Date.parse(rec.d.replace(/T.+$/i, '')) : rec.d,
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
        this.setItem(KEY_CAMPAIGNS, campaigns);

        // update tag info
        Object.keys(tags).forEach((tid) => {
            tags[tid].campaigns = affiliations.filter((aff) => aff.t == tid)
                .reduce((agg, aff) => {
                    if(agg.indexOf(aff.c) < 0)
                        agg.push(aff.c);
                    return agg;
                }, []);
            // window.console.log(tid, tags[tid], tags[tid].campaigns);
        });
        this.setItem(KEY_TAGS, tags);

        this.setItem(KEY_AFFILIATIONS, affiliations);
        window.dataLayer.push({ event: 'tagop.values.update' });

        this.setItem(KEY_LATEST_UPDATED, Date.now());

        // release lock
        this.delItem(KEY_LOCK_UPDATES);
    },

    // retrieve campaign data from server
    retrieveCampaigns: function(overwrite) {
        // nothing without access
        if(!this.hasItem(KEY_UINFO)) return [];
        if(overwrite || !this.hasItem(KEY_CAMPAIGNS)) {
            // loading lock
            if(this.hasItem(KEY_LOCK_CAMPAIGNS)
            && parseInt(this.hasItem(KEY_LOCK_CAMPAIGNS))>=Date.now()-900) return;
            this.setItem(KEY_LOCK_CAMPAIGNS, Date.now());

            this.delItem(KEY_LATEST_UPDATED);
            (async() => {
                let tags = this.retrieveTags();
                let period = this.getPeriod();
                let resp = await axios.post(`${API_HOST}/c/`, {
                    from: this.timeformat(period.from), 
                    till: this.timeformat(period.till),
                });
                let cdata = await resp.data;
                let records = cdata.records;
                let campaigns = cdata.campaigns;
                let affiliations = cdata.affiliations;
                
                this.setItem(KEY_CAMPAIGNS, campaigns);
                this.refreshUpdateValues(tags, campaigns, records, affiliations);
                this.delItem(KEY_LOCK_CAMPAIGNS);

                window.dataLayer.push({ event: 'tagop.api.campaigns' });
            })();
        }
        return this.getItem(KEY_CAMPAIGNS);
    },

    filterCampaignIds: function(filters, exceptionCls) {
        let campaigns = this.retrieveCampaigns();
        let tags = this.retrieveTags();

        // if null, return blank.
        if(!campaigns || !tags) return [];

        let cids = Object.keys(campaigns).map((cid)=>parseInt(cid));
        if(filters) {
            Object.keys(filters).forEach((cls) => {
                if(exceptionCls && cls == exceptionCls) {
                    return;
                } else {
                    let positiveFilter = filters[cls].reduce((agg, tid) => {
                        if(tags[tid].campaigns)
                            return agg.concat(tags[tid].campaigns.filter((cid)=> agg.indexOf(cid)<0));
                        else
                            return agg;
                    }, []);
                    cids = cids.filter((cid)=> 0<=positiveFilter.indexOf(cid));
                }
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
                    if(0<tcids.length) {
                        // average
                        acc.push({
                            t: tag,
                            v: tcids.reduce((sum, cid) => sum + campaigns[cid].summary.avg, 0) / Math.max(1.0, tcids.length),
                        });
                    }
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

    getPeriodRanges(period, r) {
        let days = (period.till - period.from) / 86400000;
        // let inc = 86400000;
        let radix;
        let _fm;
        // daily (0 ~ 32d); 0 to 32 points
        if(r) radix = r;
        else if(days <= 32) radix = 'day';
        // weekly (33 ~ 180d); 5 to 24 points
        else if(days <= 180) radix = 'week';
        // monthly (181 ~ 730d); 6 to 24 points
        else if(days <= 730) radix = 'month';
        // quarterly (731 ~ 1461d); 8 to 16 points
        else if(days <= 1461) radix = 'quarter';
        // yearly; 4 to ~ points
        else radix = 'year';

        switch(radix) {
            case 'day':
                _fm = 'YYYY-MM-DD'; break;
            case 'week': 
                _fm = 'YYYY [week]WW'; break;
            case 'month':
                _fm = 'MMM.YYYY'; break;
            case 'quarter':
                _fm = 'YYYY.[Q]Q'; break;
            case 'year':
                _fm = 'YYYY'; break;
        }
        let fmt = (dt) => moment(dt).format(_fm);

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

    _dailySeries: function(metric, prange, records, cids, valuesOnly) {
        let series = new Array(prange.length);
        let isAppMetric = metric === sessionStorage.getItem(KEY_METRIC);
        records
            .filter((rec)=> 0<=cids.indexOf(rec.c))
            .forEach((rec) => {
                let label = prange.fmt(rec.d);
                let didx = prange.labels.indexOf(label);
                if(!series[didx])
                    series[didx] = [];
                if(isAppMetric) {
                    series[didx].push(rec.v);
                }
                else {
                    series[didx].push(metric.fn(rec));
                }
            });
        return prange.labels.map((label,sidx) => {
                let s = series[sidx];
                if(valuesOnly) {
                    return s && 0<s.length ?
                        s.reduce((t,sv)=>t+sv/(1.0*Math.max(1, s.length)), 0) : 0;
                } else {
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
                }
                
            });
    },

    _dashboardFilters: function() {
        let filters = this.getFilter() || {};
        return Object.keys(filters)
            .filter((cls) => 0<=QUERY_MID_CLASSES.indexOf(cls))
            .reduce((agg, cls) => {
                agg[cls] = filters[cls];
                return agg;
            }, {});
    },

    dashboardSeries: function() {
        let filters = this._dashboardFilters();
        let prange = this.getPeriodRanges(this.getPeriod(), 'month');
        let metric = this.getMetric();
        let cids = this.filterCampaignIds(filters);
        let records = this.getItem(KEY_RECORDS);
        // iterate records
        return this._dailySeries(metric, prange, records, cids);
    },

    dashboardDesignRefers: function(best) {
        return this._classReferences(best, this.getPresetDesignClasses());
    },
    dashboardMessageRefers: function(best) {
        return this._classReferences(best, this.getPresetMessageClasses());
    },

    dashboardPreviews: function() {
        let filters = this._dashboardFilters();
        let campaigns = this.retrieveCampaigns();
        let cids = this.filterCampaignIds(filters);
        let metric = this.getMetric();
        let ctags = this.getTagsWithinClass('category')
            .filter((ctag) => !filters || !filters['category'] || 0<=filters['category'].indexOf(ctag.id));
        return ctags.reduce((agg, tag) => {
            let title = tag.name;
            let cmps = tag.campaigns
                .filter((cid)=> 0<=cids.indexOf(cid))
                .map((cid) => campaigns[cid]);
            let bests = this.bestPracticeOver(Object.assign({category: [tag.id]}, filters || {}));
            let cvs = cmps.map((cmp) => cmp.summary.avg);
            if(0<cvs.length) {
                agg.push({
                    title,
                    options: this.topOptionOverPractice(bests),
                    average: metric.fmt(cvs.reduce((t, cv) => t+cv, 0) / Math.max(1.0, cvs.length)),
                });
            }
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
                    agg[cls] = best[cls][best[cls].length-1].t.name;
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
        let cids = this.filterCampaignIds(filter);
        let metric = this.getMetric();
        return clss.map((cls) => {
            let ctags = this.getTagsWithinClass(cls)
                .filter((tag) => !filter || !filter[tag.class] || 0<=filter[tag.class].indexOf(tag.id));
            // 
            if(counts < ctags.length)
                ctags = ctags.slice(0, counts);
            let data = [];
            ctags.forEach((tag) => {
                let tcids = tag.campaigns.filter((cid) => 0<=cids.indexOf(cid));
                if(tcids.length<=0) 
                    return;

                let mean = tcids.reduce((total, cid) => {
                    return total + campaigns[cid].summary.avg / Math.max(1.0, tcids.length);
                }, 0);
                // no zeros!
                if(mean<=0) 
                    return;
                data.push({
                    tag,
                    cids: tcids,
                    mean,
                });
            });
            data.sort((l,r) => r.mean - l.mean);
            if(metric.ascending)
                data = data.reverse();

            return {
                cls,
                data,
            };
        });
    },
    creativeDetailChart: function(cls) {
        let filters = this.getFilter();
        let prange = this.getPeriodRanges(this.getPeriod());
        let records = this.getItem(KEY_RECORDS);
        let tags = this.getTagsWithinClass(cls);
        let cids = this.filterCampaignIds(filters);
        let alltcids = [];

        let rets = tags.map((tag) => {
            let tcids = tag.campaigns.filter((cid) => 0<=cids.indexOf(cid));
            let data = this.metrices
                .filter((met)=>!met.defaultHide)
                .reduce((agg, met)=> {
                    agg[met.key] = this._dailySeries(met, prange, records, tcids, true);
                    return agg;
                }, {});

            // append new tag cids
            alltcids = alltcids.concat(tcids.filter((cid)=>alltcids.indexOf(cid)<0));

            return {
                tag,
                t: tag.id,
                data,
            };
        });
        let alldata = this.metrices
            .filter((met)=>!met.defaultHide)
            .reduce((agg, met) => {
                agg[met.key] = this._dailySeries(met, prange, records, alltcids, true);
                return agg;
            }, {});

        // summarize total
        rets.unshift({
            tag: null,
            t: null,
            data: alldata
        });
        return {
            labels: prange.labels,
            values: rets,
        };
    },

    simulationOptionValues: function() {
        let _tags = this.getItem(KEY_TAGS);
        let ctmap = Object.keys(_tags).reduce((agg, tid) => {
            let tag = _tags[tid];
            if(!agg[tag.class])
                agg[tag.class] = [];
            agg[tag.class].push(tag);
            return agg;
        }, {});

        let _clss = Object.assign(Object.keys(ctmap), {});

        let cclss = ['category','subcategory','device', 'media', 'admedia','adtype','goal'];
        let dclss = this.getPresetDesignClasses();
        dclss = dclss.concat(_clss.filter((cls)=>cls.startsWith('design.') && dclss.indexOf(cls)<0));
        let mclss = this.getPresetMessageClasses();
        mclss = mclss.concat(_clss.filter((cls)=>cls.startsWith('content.') && mclss.indexOf(cls)<0));
        let presets = cclss.concat(dclss).concat(mclss);
        // exceptions
        presets = presets.concat(['account', 'brand', 'channel']);
        let rclss = _clss.filter((cls) => presets.indexOf(cls)<0);

        let rets = {
            campaigns: cclss.map((cls) => { return {cls, tags: ctmap[cls]}} ),
            designs: dclss.map((cls) => { return {cls, tags: ctmap[cls]}} ),
            content: mclss.map((cls) => { return {cls, tags: ctmap[cls]}} ),
            others: rclss.map((cls)=> { return {cls, tags: ctmap[cls]}} ),
        };

        return rets;
    },
    simulationResults: function(options) {
        let tags = this.retrieveTags();
        let campaigns = this.retrieveCampaigns();
        // let records = this.getItem(KEY_RECORDS);

        let cids = Object.keys(campaigns).map((cid)=>parseInt(cid));
        Object.keys(options)
            .forEach((cls) => {
                let tid = options[cls];
                let tag = tags[tid];
                cids = cids.filter((cid)=> 0<= tag.campaigns.indexOf(cid));
            });
        // sort anyway
        cids.sort();
        let ms = this.metrices.filter((m)=>!m.defaultHide);
        let values = ms.reduce((agg,m)=> { agg[m.key]=[]; return agg; }, {});
        cids.map((cid)=>campaigns[cid])
        .forEach((cmp)=> {
            ms.forEach((m)=>{
                values[m.key] = values[m.key].concat(cmp.records.map((rec)=>m.fn(rec)));
            });
        });
        let result = ms.reduce((agg, met)=> {
            agg[met.key] = values[met.key].reduce((s,v)=>s+v, 0) / values[met.key].length;
            return agg;
        }, {});

        return result;
    },
    filteredTags: function(cls) {
        let filter = /\/dashboard\/?/.exec(window.location.pathname) ? this._dashboardFilters() : this.getFilter();
        let cids = this.filterCampaignIds(filter, cls);
        let tags = this.retrieveTags();
        return Object.keys(tags)
            .map((tid)=>tags[tid])
            .filter((tag)=>tag.class==cls)
            .filter((tag) => 0<tag.campaigns.filter((cid)=>0<=cids.indexOf(cid)).length)
        // return 0<tag.campaigns.filter((cid)=> 0<=cids.indexOf(cid)).length;
    },


};
