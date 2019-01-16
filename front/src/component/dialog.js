import React from 'react';
// yg.song;  nooooooo... (20190116)
import $ from 'jquery';

class Dialog extends React.Component {
    constructor(ps) {
        super(ps);
        this.state = {
            title: '',
            subtitle: '',
            content: this.props.content,
            actions: this.props.actions,
        };
        this._modal = React.createRef();
    }

    show() {
        $(this._modal.current).modal('show');
    }

    hide() {
        $(this._modal.current).modal('hide');
    }

    renderModalHeader() {
        if(this.state.title || this.state.subtitle) {
            return (<div className="modal-header">
                <h3 className="modal-title">{this.state.title || ''}</h3>
                <h5 className="modal-subtitle">{this.state.subtitle || ''}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>);
        }
        else {
            return (<div><button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button></div>);
        }
    }

    renderModalBody() {
        return (<div className="modal-body">
            {this.state.content}
        </div>);
    }

    renderModalFooter() {
        if(this.state.actions) {
            return (<div className="modal-footer">
                {this.state.actions}
            </div>);
        } else {
            return '';
        }
    }

    render() {
        return (<div ref={this._modal}
            className='modal fade show' tabindex="-1" role="dialog" 
            aria-hidden="false">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {this.renderModalHeader()}
            {this.renderModalBody()}
            {this.renderModalFooter()}
          </div>
        </div>
      </div>);
    }
}

export default Dialog;