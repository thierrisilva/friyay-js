import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ItemRightPane extends Component {
  componentDidMount() {
    $('.item-right-pane button[data-toggle="tooltip"]').tooltip();
  }

  render() {
    return (
      <div className="modal-body item-right-pane">
        <button type="button"
                className="close" data-dismiss="modal" aria-label="Close"
                title="Close Card"
                data-toggle="tooltip"
                data-placement="bottom"
                onClick={ this.props.onClose }>
          <span aria-hidden="true">&times;</span>
        </button>
        <button onClick={() => this.props.onMinimize()}
                type="button"
                className="close minimize-btn"
                // data-dismiss="modal"
                aria-label="Close"
                title="Minimize Card"
                data-toggle="tooltip"
                data-placement="bottom">
          <span aria-hidden="true">&ndash;</span>
        </button>
      </div>
    );
  }
}

ItemRightPane.propTypes = {
  name: PropTypes.func
};

export default ItemRightPane;
