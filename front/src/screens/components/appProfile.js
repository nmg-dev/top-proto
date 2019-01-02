import React from 'react'
import { Card, CardHeader, CardContent, Icon, CardActions, IconButton, Menu, MenuItem, Chip, Avatar, Divider } from '@material-ui/core'

const styles = {};

const menuProfile = '_menu_profile';

class AppProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,

            name: null,
            email: null,
            picture: null,			
        }
    }

    /* authentication */
	
	
	/* with logins */
	renderProfileButton() {
		return (<IconButton
			aria-haspopup="true"
			aria-owns={menuProfile}
			onClick={(ev) => {
				this.setState({show: true, anchor: menuProfile})
			}}>
				<Icon>person</Icon>
		</IconButton>);
	}
	renderProfileButtonMenu() {
		return (<Menu ref={this.refs.profileMenu} id={menuProfile}
			open={this.state.show}
			onClose={()=>{this.setState({show: false, anchor: null})}}
			anchorEl={this.state.anchor}>
			<MenuItem>
				<Chip title={this.state.email}
					avatar={<Avatar 
						alt="profile image" 
						src={this.state.picture} />}
					label={this.state.name} />
			</MenuItem>
			<Divider />
			{this.props.app.listViews().map((v) => (
			<MenuItem view={v} key={v}
				style={styles.viewMenuItem}
				onClick={(ev) => {this.setState({show: true, view: ev.target.getAttribute('view')})}}>
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