import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import DropOptionItem from './drop_card_options/drop_option_item';

class DropCardOptions extends Component {
  render () {
    const {
      topic,
      parentElementId
    } = this.props;

    const parentElement = document.querySelector(`#${this.props.parentElementId}`);
    const parentElementPosition = parentElement && parentElement.getBoundingClientRect();

    return (
      <div className="drop-card-options" style={{top: parentElementId && parentElementPosition && parentElementPosition.top }}>
        <DropOptionItem topic={topic} type="move" />
        <DropOptionItem topic={topic} type="add" />
      </div>
    );
  }
}

DropCardOptions.propTypes = {
  topic: PropTypes.object.isRequired,
  parentElementId: PropTypes.string
};

export default DropCardOptions;