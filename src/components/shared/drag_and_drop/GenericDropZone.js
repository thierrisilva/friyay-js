import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';

import { dragItemTypes } from './dragTypeEnum';

/*
This is a generic card drop-zone component. It can be passed a style object, className, or have HTML/other components nested within it.
Pass functions to any of the below props that you wish to use.  They will return all of the drag containers props, and the props of the dragged item
- onHoverOver
- onDragEnter
- onDragLeave
- onDrop

To just use this dropzone an indicator for a container of drop-zones (such as a list of DragDropCardContainers) pass TRUE to the dropsDisabled prop
*/

//Functions to implement the drop:
const genericDropTarget = {
  hover(props, monitor, component) {
    if (
      monitor.isOver({ shallow: true }) &&
      props.onHoverOver &&
      !props.dropsDisabled
    ) {
      props.onHoverOver({
        dropZoneProps: { ...props },
        draggedItemProps: { ...monitor.getItem() }
      });
    }
  },
  drop(props, monitor) {
    if (
      monitor.isOver({ shallow: true }) &&
      props.onDrop &&
      !props.dropsDisabled
    ) {
      props.onDrop({
        dropZoneProps: { ...props },

        draggedItemProps: { ...monitor.getItem() },
        monitor
      });
      // This doesn't work with nested zones:
      // props.onDrop({dropZoneProps: {...props}, draggedItemProps: {...monitor.getItem(), ...props.draggedItemProps}, monitor});
    }
  },
  canDrop(props, monitor) {
    return !props.dropsDisabled;
  }
};

function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverShallow: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    draggedItem: monitor.getItem()
  };
}

class GenericDropZone extends React.Component {
  static propTypes = {
    canDrop: PropTypes.bool,
    dropZoneId: PropTypes.number,
    draggedItem: PropTypes.object,
    isOver: PropTypes.bool,
    isOverShallow: PropTypes.bool,
    onDragEnter: PropTypes.func,
    onDragLeave: PropTypes.func,
    dropsDisabled: PropTypes.bool,
    children: PropTypes.node,
    connectDropTarget: PropTypes.func,
    itemType: PropTypes.oneOfType([
      PropTypes.oneOf(Object.values(dragItemTypes)),
      PropTypes.arrayOf(PropTypes.oneOf(Object.values(dragItemTypes)))
    ]),
    dropClassName: PropTypes.string,
    style: PropTypes.object
  };

  componentDidUpdate = prevProps => {
    const { isOver, onDragEnter, onDragLeave, isOverShallow } = this.props;

    if (isOverShallow && !prevProps.isOverShallow && prevProps.onDragEnter) {
      onDragEnter({
        dropZoneProps: { ...this.props },
        draggedItemProps: { ...prevProps.draggedItem }
      });
    } else if (!isOver && prevProps.isOver && prevProps.onDragLeave) {
      onDragLeave({
        dropZoneProps: { ...this.props },
        draggedItemProps: { ...prevProps.draggedItem }
      });
    }
  };

  render() {
    const {
      connectDropTarget,
      isOver,
      itemType,
      canDrop,
      dropClassName,
      style,
      draggedItem
    } = this.props;

    const dropZoneClasses = classNames(dropClassName, {
      'highlight-drop-zone':
        draggedItem &&
        (draggedItem.itemType == itemType ||
          itemType.includes(draggedItem.itemType)),
      'cant-drop': !canDrop && isOver,
      'is-over': isOver
    });

    return connectDropTarget(
      <div className={dropZoneClasses} style={style}>
        {this.props.children}
      </div>
    );
  }
}

export default DropTarget(
  props => props.itemType,
  genericDropTarget,
  dropCollect
)(GenericDropZone);
