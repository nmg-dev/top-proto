import React from 'react'
import { Card, CardHeader, CardContent, Icon, CardActions, IconButton, Menu, MenuItem, Chip, Avatar, Divider } from '@material-ui/core'

const styles = {};

const menuProfile = '_menu_profile';

class AppProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			show: false,
			anchor: null,

            name: null,
            email: null,
            picture: null,			
        }
	}
	
	_onSelect(ev) {
		let vcode = ev.target.getAttribute('view');
		this.setState({show: false, anchor: null});
		this.props.update(vcode);
	}
	
	/* with logins */
	renderProfileButton() {
		return (<IconButton
			aria-haspopup="true"
			aria-owns={menuProfile}
			onClick={(ev) => {
				this.setState({show: true, anchor: ev.target})
			}}>
				<Icon>person</Icon>
		</IconButton>);
	}
	renderProfileButtonMenu() {
		return (<Menu 
			open={this.state.show}
			onClose={()=>{this.setState({show: false, anchor: null})}}
			anchorEl={this.state.anchor}>
			<MenuItem>
				<Chip title={this.props.profile.email}
					avatar={<Avatar 
						alt="profile image" 
						src={this.props.profile.icon} />}
					label={this.props.profile.name} />
			</MenuItem>
			<Divider />
			{this.props.app.listViews().map((v) => (
			<MenuItem view={v} key={v}
				style={styles.viewMenuItem}
				onClick={this._onSelect.bind(this)}>
				{this.props.app.lang.tr(v, '')}
			</MenuItem>))}
		</Menu>);
    }
    
    render() {
        return (<span>
            {this.renderProfileButton()}
            {this.renderProfileButtonMenu()}
        </span>);
    }

}

export default AppProfile;