import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';
import { stateMappings } from 'Src/newRedux/stateMappings';
import Icon from 'Components/shared/Icon';
import CtrlKeyDragInfo from './CtrlKeyDragInfo';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
//
const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

function getItemStyles(props) {
  const { currentOffset } = props;
  if (!currentOffset) {
    return {
      display: 'none'
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform
  };
}

class CustomDragLayer extends PureComponent {
  render() {
    const { item, itemType, isDragging, ctrlKeyDown } = this.props;
    if (!isDragging) {
      return null;
    }

    const DragPreview = this.props.item.dragPreview;

    return (
      <div style={layerStyles}>
        <div className="custom-drag-preview" style={getItemStyles(this.props)}>
          {this.props.item.dragPreview}
          {ctrlKeyDown && (
            <div className="custom-drag-preview_copy-indicator-container">
              <Icon icon="add_to_photos" additionalClasses="green" />
            </div>
          )}
        </div>
        {itemType == dragItemTypes.CARD && <CtrlKeyDragInfo />}
      </div>
    );
  }
}

CustomDragLayer.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  // currentOffset: PropTypes.shape({
  //   x: PropTypes.number.isRequired,
  //   y: PropTypes.number.isRequired
  // }),
  isDragging: PropTypes.bool.isRequired
};

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
}

const mapState = (state, props) => ({
  ctrlKeyDown: stateMappings(state).utilities.ctrlKeyDown
});

export default connect(mapState)(DragLayer(collect)(CustomDragLayer));
