import axios from "axios";

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
        { key: 'cpc', label: 'CPC', fn: (v) => (v.clk/Math.max(1, v.cost)), fmt: (v)=> `${v.toLocaleString()} 원`, desc: 'Cost Per Click', },
        { key: 'cpa', label: 'CPA', fn: (v) => (v.cnv/Math.max(1, v.cost)), fmt: (v)=> `${v.toLocaleString()} 원`, desc: 'Cost Per Action', },
        { key: 'ctr', label: 'CTR', fn: (v) => (v.clk/Math.max(1, v.imp)), fmt: (v)=> `${(100*v).toFixed(2)} %`, desc: 'Click Through Rate' },
        { key: 'cvr', label: 'CVR', fn: (v) => (v.cnv/Math.max(1, v.imp)), fmt: (v)=> `${(100*v).toFixed(2)} %`, desc: 'Conversion Rate' },
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
        { cls: 'message.keytopic', label: '주제' },
        { cls: 'message.keyword', label: '키워드' },
        { cls: 'message.trigger', label: '트리거' },
        { cls: 'message.adcopy', label: '카피' },
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
        let dd;
        switch(typeof dt) {
            case 'string':
            case 'number': 
                dd = new Date(dt); break;
            case 'object':
            default:
                dd = dt; break;
        }

        let yy = dd.getFullYear();
        let mm = dd.getMonth()+1;
        mm = mm<10 ? `0${mm}` : mm.toFixed(0);
        let d = dd.getDate();
        d = d<10 ? `0${d}` : d.toFixed(0);
        return `${yy}-${mm}-${d}`;
        
    },

    timeformat: function(dt) {
        return `${this.dateformat(dt)}T00:00:00+09:00`;
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
    retrieveTags: async function(overwrite) {
        if(overwrite || !this.hasItem(KEY_TAGS)) {
            let resp = await axios.get(`${API_HOST}/t/`);
            this.setItem(KEY_TAGS, await resp.data);
        }
        return this.getItem(KEY_TAGS);
    },

    // retrieve campaign data from server
    retrieveCampaigns: async function(overwrite) {
        if(overwrite || !this.hasItem(KEY_CAMPAIGNS)) {
            let period = this.getPeriod();
            let resp = await axios.post(`${API_HOST}/c/`, {
                from: this.timeformat(period.from), 
                till: this.timeformat(period.till),
            });
            let cdata = await resp.data;
            Object.keys(cdata).forEach((ck)=>{ 
                this.setItem(ck, cdata[ck])
            });
        }
        return this.getItem(KEY_CAMPAIGNS);
    },

    // filter records
    filterRecords: function(tagFilters) {
        let records = this.getItem(KEY_RECORDS);
        let affs = this.getItem(KEY_AFFILIATIONS);
        // TODO:
    },

    // dashboard
    computeDashboardPractices: function() {
        let filters = this.getFilter();
    }

};