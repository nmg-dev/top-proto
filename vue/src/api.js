import axios from 'axios';

const API_HOST = 'http://localhost:8080';
class APIWorker {
    static onGoogleLoginSuccess(gauth) {
        window.__api = new APIWorker(gauth);
        return window.__api.waitLogin()
            .catch((err)=>{ window.console.error(err); })
            .then(()=> {
                window.console.log('login success');
                window.__api.getTags();
                window.__api.getCampaigns('2017-01-01T00:00:00+09:00', '2018-12-31T00:00:00+09:00');
                // move
                window.location = '/#/';
            });

    }

    static onGoogleLoginFailure(gauth) {
        window.__api = null;
    }

    constructor(gauth) {
        let resp = gauth.getAuthResponse();
            let profile = gauth.getBasicProfile();
            let gdata = {
                gid: profile.getId(),
                email: profile.getEmail(),
                token: resp.id_token,
            };

        axios.post(`${API_HOST}/auth`, gdata)
            .then(this.onAuthSuccess.bind(this))
            .catch(this.onRespFailure.bind(this));
    }

    getTags() {
        if(!this.hasLogin()) return;

        axios.get(`${API_HOST}/t/`)
            .catch(this.onRespFailure.bind(this))
            .then(this.onGetTagsSuccess.bind(this));
    }

    getCampaigns(from, till, ids) {
        if(!this.hasLogin()) return;
        axios.post(`${API_HOST}/c/`, {
            from: from,
            till: till
        })
            .catch(this.onRespFailure.bind(this))
            .then(this.onPostCampaignsSuccess.bind(this));
    }

    onGetTagsSuccess(tags) {
        window.console.log(tags);
        this._tags = tags.data;
    }

    onPostCampaignsSuccess(campaigns) {
        window.console.log(campaigns);
        this._campaigns = campaigns.data;
    } 

    onAuthSuccess(authResp) {
        window.console.log(authResp.data);
        // this._token = authResp.data.token;
        this._uinfo = authResp.data;
    }

    onRespFailure(authResp) {
        window.console.error(authResp);
    }

    getEmail() {
        if(this._uinfo)
            return this._uinfo.email;
    }

    getName() {
        if(this._uinfo) return this._uinfo.profile.name;
    }

    getIcon() {
        if(this._uinfo) return this._uinfo.profile.picture;
    }

    canAdmin() {
        if(this._uinfo) return this._uinfo.can_admin;
    }

    canInput() {
        if(this._uinfo) return this._uinfo.can_input;
    }

    hasLogin() {
        return !(!this._uinfo);
    }

    _promisedLogin(rs, rj) {
        // no duplicated intervals allowed
        if(this._checkLoginInterval) return;

        this._checkLoginInterval = setInterval(() => {            
            if(!this._checkLoginInterval) rj('interval removed');

            window.console.log(this, this.hasLogin(), this._uinfo);

            if(this.hasLogin()) {
                clearInterval(this._checkLoginInterval);
                rs();

                window.console.log(this._uinfo);
            }
        }, 500);
    }

    waitLogin() {
        return new Promise(this._promisedLogin.bind(this));
    }
}

export default APIWorker;