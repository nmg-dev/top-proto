import React from 'react';
import {} from 'mdbreact';

class Select extends React.Component {
    constructor(ps) {
        super(ps);
        this.state = {
            value: this.props.defaultValue
        }
        this.control = React.createRef();
    }

    input() {
        return this.control.current;
    }

    render() {
        return (<select className="form-control"
            ref={this.control}
            name={this.props.name}
            value={this.state.value}
            onChange={this.props.onChange}
            onFocus={this.props.onFocus}
            >
            {this.props.options.map((opt)=><option key={opt} value={opt.value} onClick={this.props.onItemClick}>{opt.label}</option>)}
        </select>);
    }
}

export default Select