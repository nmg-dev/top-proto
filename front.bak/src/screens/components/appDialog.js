import React from 'react';
import { CardHeader } from '@material-ui/core';

const styles = {

};

class AppDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        };
        
    }

    render() {
        return (<Modal open={this.state.show} onClose={this.props.onClose}>
            <Card>
                <CardHeader
                    title={this.props.title}
                    action={this.props.shortcut}
                    subheader={this.props.subheader}
                />
                {this.props.content}
                {this.props.actions}
            </Card>
        </Modal>);
    }
}

export default AppDialog