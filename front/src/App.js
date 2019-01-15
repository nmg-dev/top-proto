import React from 'react';
import './App.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navigation from './component/navigation';

import DashboardScreen from './screen/dashboard';
import CreativeScreen from './screen/creative';
import PredictScreen from './screen/predict';

const styles = {
  default: {},
  container: {
    display: 'flex',
    marginTop: '56px',
  },
  sidebar: {},
  sidebarItem: {},
  sidebarholder: {},
}


const views = [
  {v: 'dashboard', ko: '업종별 분석', en: 'Dashboard'},
  {v: 'creative', ko: '크리에이티브 분석', en: 'Dashboard'},
  {v: 'predict', ko: '예상 효율 확인', en: 'Dashboard', disabled: true},
];

class App extends React.Component {
  constructor(ps) {
    super(ps);
    this.state = {
      // view: 'dashboard',
      view: 'predict',
      showSidebar: true,
    }
  }

  componentDidMount() {
    document.title = 'TagOperation beta by NextMediaGroup';
  }

  renderSidebar() {
    return (<div className="sidebar background-dark">
      {this.state.showSidebar ? (<div style={{minWidth: 200}}><ul style={{position: 'fixed'}}>
        <li class="sidebar-item"><img alt="sidebar logo" src="/img/logo_md.png" /></li>
            {views.map((vs)=>(<li key={vs.v} view={vs.v}
              className={'sidebar-item'+(this.state.view==vs.v?' active':'')}
              onClick={this._onViewUpdate.bind(this)}>
            {vs.ko}</li>))}
      </ul></div>) : ''}
      <div class="sidebar-holder" onClick={()=>this.setState({showSidebar: !this.state.showSidebar})}>
        <i className={'fas fa-chevron-' + (this.state.showSidebar ? 'left' : 'right')} />
      </div>
    </div>);
  }

  renderStagedView(v) {
    switch(v) {
      case 'predict': return <PredictScreen />;
      case 'creative': return <CreativeScreen />;
      case 'dashboard':
      default:
        return <DashboardScreen />;
    }
  }

  render() {
    return (<div style={styles.default}>
      <Navigation className="background-dark" />
      <main className="background-light wrap-container" style={styles.container}>
        {this.renderSidebar()}
        {this.renderStagedView(this.state.view)}
      </main>
    </div>) 
  }

  _onViewUpdate(ev) {
    let v = ev.target.getAttribute('view');
    // if(v=='predict') 
    //   return;
    this.setState({
      view: v
    });
  }
}

export default App;
