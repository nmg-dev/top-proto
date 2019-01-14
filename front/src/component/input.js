import React from 'react';
import {} from 'mdbreact';

class Input extends React.Component {
    constructor(ps) {
        super(ps);
        this.state = {

        }
        this.control = React.createRef();
    }

    input() {
        return this.control.current;
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor={this.control}>{this.props.label}</label>
                <input className="form-control"
                    ref={this.control}
                    type={this.props.type}
                    onChange={this.props.onChange}
                    onInput={this.props.onInput}
                    onFocus={this.props.onFocus}
                    />
            </div>
        );
    }
}

export default Input