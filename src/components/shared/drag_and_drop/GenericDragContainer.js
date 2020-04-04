import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { setShowAddCardBottomOverlay } from 'Src/newRedux/interface/modals/actions';

import { toggleUtilityValue } from 'Src/newRedux/utilities/actions';
//A simple container for a draggable card.
//Pass the card/tip object into the 'card' prop, and an object of other details to 'draggedItemProps'
//Give the container a class that contains a subclass 'is-dragging' to change the style of the dragged object

// Functions to implement the drag:
const dragSource = {
  beginDrag(props) {
    return {
      ...props.draggedItemProps,
      item: props.item,
      itemType: props.itemType,
      dragPreview: props.dragPreview
    };
  },
  endDrag(props, monitor) {
    if (monitor.getDropResult() == null)
      props.setShowAddCardBottomOverlay(false);
    props.onDropElsewhere(props); //Tells the parent that the item was dropped so it should reset its list
  },
  canDrag(props) {
    return !props.dragDisabled;
  }
};

const dragCollect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
};

class GenericDragContainer extends React.Component {
  componentDidMount = () => {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true
    });
  };

  handleDrag = e => {
    const {
      ctrlKeyDown,
      toggleUtilityValue,
      setShowAddCardBottomOverlay,
      isFileDragged,
      isDragging
    } = this.props;
    if (
      this.props.itemType == dragItemTypes.FILE &&
      isFileDragged != isDragging
    )
      setShowAddCardBottomOverlay(isDragging);
    e.ctrlKey !== ctrlKeyDown && toggleUtilityValue({ ctrlKeyDown: e.ctrlKey });
  };

  render() {
    const {
      connectDragSource,
      isDragging,
      itemIsDragging,
      dragClassName,
      style
    } = this.props;

    const dragContainerClasses = classNames(dragClassName, {
      'is-dragging': isDragging || itemIsDragging
    });

    return connectDragSource(
      <div
        className={dragContainerClasses}
        style={style}
        onDrag={this.handleDrag}
      >
        {this.props.children}
      </div>
    );
  }
}

GenericDragContainer.propTypes = {
  dragClassName: PropTypes.string, //a classname for styling the container (optional)
  style: PropTypes.object, //a style object for styling the container (optional)
  itemIsDragging: PropTypes.bool, //pass an override (used when the card is moved to another container so is remounted there)
  isDragging: PropTypes.bool,
  children: PropTypes.node,
  connectDragSource: PropTypes.func,
  ctrlKeyDown: PropTypes.bool,
  toggleUtilityValue: PropTypes.func,
  connectDragPreview: PropTypes.func,
  dragDisabled: PropTypes.bool
};

const mapState = (state, props) => ({
  ctrlKeyDown: stateMappings(state).utilities.ctrlKeyDown,
  isFileDragged: state._newReduxTree.ui.modals.showAddCardBottomOverlay
});

const mapDispatch = {
  toggleUtilityValue,
  setShowAddCardBottomOverlay
};

export default connect(
  mapState,
  mapDispatch
)(
  DragSource(props => props.itemType, dragSource, dragCollect)(
    GenericDragContainer
  )
);
