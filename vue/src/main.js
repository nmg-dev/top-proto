import Vue from 'vue'


// bootstrap
import BootstrapVue from 'bootstrap-vue';
import MomentVue from 'vue-moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';

import App from './App';
import Route from './routes.js';


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
  },
  mounted: function() {
  },
}).$mount('#app')
