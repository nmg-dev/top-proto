import Vue from 'vue'


// bootstrap
import BootstrapVue from 'bootstrap-vue';
import MomentVue from 'vue-moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';

import App from './App';
import Route from './routes.js';

import utils from './utils.js';

// GTM ON
const GTM_ID = 'GTM-NKNJZMQ';
utils.gtm(GTM_ID);

// default metric / period
utils.getMetric();
utils.getPeriod();

// import 'font-awesome/css/font-awesome.min.css';
Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(Route.useRouter());
Vue.use(MomentVue);


new Vue({
  render: h => h(App),
  router: Route.initRouter(),
  data: {
    app: App,
    api_token: null,
    profile: null,
    metric: null,
    period: null,
    lang: 'ko',
  },
  beforeMount: function() {
  },
  methods: {
    getItem: function(key) {
      let vals = window.sessionStorage.getItem(key);
      return vals ? JSON.parse(vals) : undefined;
    },
    setItem: function(key, value) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    },
    getApp: function() { return this.app; },
    getLanguage: function() { return this.lang; },
    refreshUpdate: function() {
      this.app.$forceUpdate();
    },
  },
  mounted: function() {
  },
}).$mount('#app')
