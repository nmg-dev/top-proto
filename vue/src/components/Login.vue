<template>
    <div class="container-fluid panel-wrapper m-0 p-4">
        <div class="row">
            <div class="col col-12 justify-content-center align-items-center">
                <div class="g-signin2" 
                    data-onsuccess="__onGoogleLoginSuccess"
                    data-onerror="__onGoogleLoginFailure">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-12 justify-content-end align-items-baseline">
                <h5>by <a href="https://www.nextmediagroup.co.kr" target="_blank" rel="noopener noreferrer">NextMediaGroup</a></h5>
            </div>
        </div>
    </div>
</template>

<script>
import utils from '../utils.js';
import routes from '../routes.js';

window.__onGoogleLoginSuccess = function(gauth) {
    // let guser = gauth.getAuthResponse();
    // utils.setItem('access_token', guser.id_token);
    utils.authenticate(gauth);

    // after login data checkup
    let dataCheckupInterval = setInterval(()=> {
        let checks = utils.checkup_keys.reduce((agg, ck) => {
            if(!agg) return false;
            window.console.log(`${ck} checking...`);
            return utils.hasItem(ck);
        }, true);

        if(checks) {
            clearInterval(dataCheckupInterval);
            window.history.back();
        }
    }, 500);
}

window.__onGoogleLoginFailure = function() {
    window.console.error('login error', arguments);
}

export default {
    name: 'glogin',
    created() {
        utils.gauth();
    },
    methods: {
        onLoginSuccess: function(resp) {
            window.console.log('login success', resp);
        },
        onLoginFailure: function() {
            window.console.error('login errors', arguments);
        }
    },
    mounted() {
    },
}
</script>