import Listenable from './listenable';

const AUTH_DEFAULT = { email: '', name: 'NMG', icon: ''};
const ENDPOINT_AUTH = '/auth';
const ENDPOINT_TAGS = '/t/';
const ENDPOINT_CAMPAGIN = '/c/';

class ModApi extends Listenable {
    constructor(apiHost, onErrorDefault, onSuccessDefault) {
        super();

        this._host = apiHost;
        this._onError = onErrorDefault;
        this._onSuccess = onSuccessDefault;

        this._hasLogin = false;
        this._token = null;
        this._can_admin = false;
        this._can_manage = false;

        this._profile = AUTH_DEFAULT;
    }

    hasLogin() {
        return this._hasLogin && this._token;
    }

    userProfile() {
        return this._profile;
    }

    accessToken() {
        return this.login() ? this._token : null;
    }

    canAdmin() {
        return this.login() && this._can_admin;
    }

    canManage() {
        return this.login() && this._can_manage;
    }

    _onApiErrorDefault(err) {
        window.alert(err);
        return err;
    }
    _request(endpoint, options, onSuccess, onError) {
        if(endpoint!==ENDPOINT_AUTH && !this.hasLogin()) {
            return onError ? onError('Login required') : null;
        }
        options.credentials = 'include';
        return fetch(this._host + endpoint, options)
            .catch(onError ? onError : this._onError)
            .then((plainResp) => plainResp.json())
            .then(onSuccess ? onSuccess : this._onSuccess);
    }
    _onAuthResponseSuccess(uinfo) {
        this._hasLogin = true;
        this._token = uinfo.token;
        this._can_admin = uinfo.can_admin;
        this._can_manage = uinfo.can_manage;
        this._profile = {
            email: uinfo.email,
            name: uinfo.profile.name,
            icon: uinfo.profile.picture,
        };

        return uinfo;
    }
    _onAuthResponseFailure(err) {
        this._hasLogin = false;
        this._token = null;
        this._can_admin = false;
        this._can_manage = false;
        this._profile = AUTH_DEFAULT;

        return err;
    }
    getAuth(body, onSuccess, onError) {
        return this._request(ENDPOINT_AUTH, {
            method: 'POST',
            body: JSON.stringify(body)
        }, 
            this._onAuthResponseSuccess.bind(this), 
            this._onAuthResponseFailure.bind(this))
        .catch(onError)
        .then(onSuccess);
    }
    getTags(onSuccess, onError) {
        return this._request(ENDPOINT_TAGS, {method: 'GET'},
            onSuccess, onError);
    }
    getCampaigns(body, onSuccess, onError) {
        return this._request(ENDPOINT_CAMPAGIN, {
            method: 'POST',
            body: JSON.stringify(body),
        }, onSuccess, onError);
    }
}

export default ModApi;