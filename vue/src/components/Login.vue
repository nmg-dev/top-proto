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
import api from '../api.js';

export default {
    name: 'glogin',
    created() {
        window.__onGoogleLoginSuccess = api.onGoogleLoginSuccess;
        window.__onGoogleLoginFailure = api.__onGoogleLoginFailure;
        utils.gauth();
    },
    mounted() {
        this.$root.$emit('displayControls', [false, false, false]);
    },
}
</script>