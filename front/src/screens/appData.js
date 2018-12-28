import React from 'react';
import AppCommon from './appCommon';

class AppData extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<AppCommon 
            app={this.props.app}
            lang={this.props.app.getLocale()}
            api={this.props.api} />);
    }
}

export default AppData;