import moment from 'moment';

const PREDEFINED_CATEGORIES = ['category', 'goal', 'channel', 'media'];
const PREDEFINED_METRICS = [
    {key: 'cpc', calc: (v) => (v.clk/Math.max(1,v.cost)) },
    {key: 'cpa', calc: (v) => (v.cnv/Math.max(1,v.cost)) },
    {key: 'ctr', calc: (v) => (v.clk/Math.max(1,v.imp)) },
    {key: 'cvr', calc: (v) => (v.cnv/Math.max(1,v.imp)) },
    {key: 'cnt', calc: (v) => 1, hide: true },
];

class ModData {
    constructor() {
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


    scoremap() {
        // TODO:
        // let cids = this.campaigns.map((c)=>c.id);
        // let tids = this.tags.map((t) => t.id);
        // this._affs.filter((a) => 0<=cids.indexOf(a.c) && 0<=tids.indexOf(a.t));

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

        this.setAffiliation();
    }


    setCampaigns(cdata) {
        this._campaigns = cdata.campaigns;
        this._records = cdata.records;
        this._affs = cdata.affiliations;

        this._records.forEach((r) => {
            if(!this._campaigns[r.c]) return;
            r.d = moment(r.d);
            if(!this._campaigns[r.c]._r) this._campaigns[r.c]._r = [];
            this._campaigns[r.c]._r.push(r);
        });

        this.campaigns = [];
        Object.keys(this._campaigns).forEach((c) => {
            // 
            this._campaigns[c]._r = this._campaigns[c]._r.sort((l,r)=>l.d.isAfter(r.d));
            //
            this.campaigns.push(this._campaigns[c]);
        });

        this.setAffiliation();
    }

    filterByCampaignIds(cids) {
        this.campaigns = 
            this.campaigns.filter((c)=> 0<= cids.indexOf(c.id));
        this.tags = this.filteredTags(cids);
    }

    setAffiliation() {
        if(!this._affs && this._tags && this._campaigns) {
            Object.keys(this._campaigns).forEach((c) => {
                this._campaigns[c]._t = [];
            });
            Object.keys(this._tags).forEach((t) => {
                this._tags[t]._c = [];
            });
            Object.keys(this._affs).forEach((a) => {
                if(this._campaigns[a.c] && this._tags[a.t]) {
                    this._campaigns[a.c]._t.push(a.t);
                    this._tags[a.t]._c.push(a.c);
                }
            });
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

    allTagClasses(includePredefineds) {
        let names = [];
        if(this.tags)
            names = this._uq(Object.keys(this.tags).map((t)=>t.class));
        else if(this._tagmap)
            names = Object.keys(this._tagmap);
        return includePredefineds ? 
            PREDEFINED_CATEGORIES.concat(names) : names;
    }

}
export default ModData;