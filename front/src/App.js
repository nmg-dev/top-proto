import React from 'react';
import './App.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApplicationContext from './AppContext';
import Navigation from './component/navigation';
import Sidebar from './component/sidebar';

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


class App extends React.Component {
	constructor(ps) {
		super(ps);
		this.state = {
			view: Sidebar.indexViewAccessor()
		}
	}
	
	componentDidMount() {
		document.title = 'TagOperation beta by NextMediaGroup';
	}
	
	renderStagedView() {
		return Sidebar.renderStagedAppScreen(this.state.view);
	}
	
	render() {
		return (<ApplicationContext.Provider>
			<div style={styles.default}>
				<Navigation className="background-dark" />
				<main className="background-light wrap-container" style={styles.container}>
					<Sidebar onClickItem={this._onViewUpdate.bind(this)} />
					{this.renderStagedView()}
				</main>
			</div>
		</ApplicationContext.Provider>); 
	}
		
	_onViewUpdate(vk) { this.setState({view: vk}); }
}
	
export default App;
	