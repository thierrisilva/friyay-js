import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';
import ItemTypes from '../../lib/item_types';

import ItemDragPreview from './items_container/item_drag_preview';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 9999,
  left: 0,
  top: 0,
  width: '100%',
  height: '100px'
};

const scrollPerTic = 10;
let requestedFrame = null;

const drawFrameScrollDown = () => {
  const body = document.querySelector('body');
  body.scrollTop = body.scrollTop + scrollPerTic;

  requestedFrame = null;
};

const drawFrameScrollUp = () => {
  const body = document.querySelector('body');
  body.scrollTop = body.scrollTop - scrollPerTic;

  requestedFrame = null;
};

function getItemStyles(props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

	let { x, y } = currentOffset;
	
  const transform = `translate(${x}px, ${y}px)`;
  
  let winHeightUp = 200;
  let winHeightDown = window.windowHeight - winHeightUp;

  // scroll down
  if (y > winHeightDown) {
    if (!requestedFrame) {
      requestedFrame = requestAnimationFrame(drawFrameScrollDown);
    }
  }

  // scroll up
  if (y < winHeightUp) {
    if (!requestedFrame) {
      requestedFrame = requestAnimationFrame(drawFrameScrollUp);
    }
  }

  return {
    transform,
    WebkitTransform: transform,
  };
}

function collectSource(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  };
}

class CustomDragLayer extends Component {

  renderItem(type, item, viewType) {
    switch (type) {
      case ItemTypes.CARD_ITEM:
        return (<ItemDragPreview item={item.item} viewType={viewType} />);
      default:
        return null;
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props;

    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item, item.viewType)}
        </div>
      </div>
    );
  }
}

CustomDragLayer.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  initialOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  currentOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  isDragging: PropTypes.bool.isRequired,
  viewType: PropTypes.string
};

export default DragLayer(collectSource)(CustomDragLayer);