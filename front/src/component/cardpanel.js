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
        return this.props.title ? <h5 class="card-title">
            {this.props.title}
        </h5> : '';
    }

    render() {
        return (<div class="card panel shadow" style={this.props.style}>
            {this.renderCardImage()}
            {this.renderCardTitle()}
            <div class="card-text">
                {this.props.body}
            </div>
        </div>);
    }
}

export default CardPanel;