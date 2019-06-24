<template>
    <div class="d-flex flex-column justify-content-between align-items-center">
        <h3 class="panel-title">Login</h3>
        <div class="g-signin2" 
            data-onsuccess="__onGoogleLoginSuccess"
            data-onerror="__onGoogleLoginFailure">
        </div>
        <b-list-group class="loading-status" :key="latest_success">
            <template v-for="ck in checkups">
                <b-list-group-item>
                    {{ ck.l }}
                    <template v-if="ck.f">
                        &nbsp; <i class="fas fa-check" style="color: var(--success)" />
                    </template>
                    <template v-else>
                        ... <b-spinner type="grow" variant="success" />
                    </template>
                </b-list-group-item>
            </template>
        </b-list-group>
    </div>
</template>

<script>
import utils from '../utils.js';
import routes from '../routes.js';

window.__onGoogleLoginSuccess = function(gauth) {
    // let guser = gauth.getAuthResponse();
    // utils.setItem('access_token', guser.id_token);
    utils.authenticate(gauth)
        .then(()=>{ 
            utils.retrieveTags(true);
            utils.retrieveCampaigns(true); 
        });

}

window.__onGoogleLoginFailure = function() {
    window.console.error('login error', arguments);
}

export default {
    name: 'glogin',
    created() {
        utils.gauth();
    },
    data: function() {
        return {
            checkups: utils.loading_check(),
            latest_success: 0,
            interval: setInterval((() => {
                if(this.latest_success == this.checkups.length-1) {
                    clearInterval(this.interval);
                    // window.history.back();
                    if(this.$route.query.b && /^\/.+/.exec(this.$route.query.b)) {
                        this.$router.push(this.$route.query.b);
                        // window.location = `/#${this.$route.query.b}`;
                    } else {
                        this.$router.push('/dashboard');
                        // window.location = '/#/dashboard';
                    }
                } else {
                    if(utils.hasItem(this.checkups[this.latest_success].k)) {
                        this.checkups[this.latest_success].f = true;
                        this.latest_success += 1;
                    }
                }
                window.console.log(this.latest_success);
            }).bind(this), 250),
        }
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