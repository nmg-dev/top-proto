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
}


const views = [
  {v: 'dashboard', ko: '업종별 분석', en: 'Dashboard'},
  {v: 'creative', ko: '크리에이티브 분석', en: 'Dashboard'},
  {v: 'predict', ko: '예상 효율 확인', en: 'Dashboard'},
];

class App extends React.Component {
  constructor(ps) {
    super(ps);
    this.state = {
      view: 'dashboard',
      showSidebar: true,
    }
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
      <Navigation className="bg-dark" />
      <main className="bg-light wrap-container" style={styles.container}>
        <div className="bg-dark">
            <ul style={styles.sidebar}>
                <li style={styles.sidebarItem}><img alt="sidebar logo" src="/img/logo_md.png" /></li>
                {views.map((vs)=><li style={styles.sidebarItem} key={vs.v}>
                    <a view={vs.v} onClick={this._onViewUpdate.bind(this)}>{vs.ko}</a>
                </li>)}
            </ul> 
        </div>
        {this.renderStagedView(this.state.view)}
      </main>
    </div>) 
  }

  _onViewUpdate(ev) {
    this.setState({
      view: ev.target.getAttribute('view')
    });
  }
}

export default App;
