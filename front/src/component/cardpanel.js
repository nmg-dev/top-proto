import React from 'react';

class CardPanel extends React.Component {
    constructor(ps) {
        super(ps);
        this.state = {};
    }

    renderCardImage() {
        return this.props.embed ? this.props.embed : '';
    }

    renderCardTitle() {
        return this.props.title ? <h5 className="card-title">
            {this.props.title}
        </h5> : '';
    }

    render() {
        return (<div className="card panel shadow m-0 p-4" style={this.props.style}>
            {this.renderCardImage()}
            {this.renderCardTitle()}
            <div className="card-text">
                {this.props.body}
            </div>
        </div>);
    }
}

export default CardPanel;