import VueRouter from 'vue-router';

import dashboardScreen from './components/Dashboard';
import creativeScreen from './components/Creative';
import simulationScreen from './components/Simulation';
import loginScreen from './components/Login';

const showTopControlPaths = ['dashboard', 'creative'];
const showMidControlPaths = ['dashboard', 'creative'];
const showDownControlPaths = ['creative'];

export default {
    keys: ['dashboard','creative','simulation','login'],
    values: {
        dashboard: {
            path: '/dashboard',
            component: dashboardScreen,
            name: '업종별 분석',
          },
          creative: {
            path: '/creative',
            component: creativeScreen,
            name: '크리에이티브 분석',
          },
          simulation: {
            path: '/simulation',
            component: simulationScreen,
            name: '예상효율 확인',
          },
          login: {
            path: '/login',
            component: loginScreen,
          }
    },
    paths: function() {
        return this.keys.map((rk)=>this.values[rk].path);
    },
    
    useRouter() {
        return VueRouter;
    },

    initRouter() {
        let rt = new VueRouter({ routes: this.keys.map((rk)=>this.values[rk]) });
        rt.afterEach((to) => {
          window.document.title = `[NMG]TagOperation ${to.name}`;
          let rtopt = {
            event: 'tagop.pageview',
            path: to.path,
            params: to.params,
            query: to.query,
            hash: to.hash,
            fullpath: to.fullPath,
            redirected: to.redirectedFrom,
          };
          window.dataLayer.push(rtopt);
        });
        return rt;
    },

    index: function() {
        return this.values.dashboard.path;
    },

    _showControls(path, _paths) {
        return 0 <= this.keys.filter((rk) => 0<=_paths.indexOf(rk))
            .map((rk)=>this.values[rk].path)
            .indexOf(path);
    }, 

    showTopControls(path) { return this._showControls(path, showTopControlPaths); },
    showMidControls(path) { return this._showControls(path, showMidControlPaths); },
    showDownControls(path) { return this._showControls(path, showDownControlPaths); },


}