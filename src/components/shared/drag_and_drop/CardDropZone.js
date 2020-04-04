import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';

/*
This is a generic card drop-zone component. It can be passed a style object, className, or have HTML/other components nested within it.
Pass functions to any of the below props that you wish to use.  They will return all of the drag containers props, and the props of the dragged item
- onHoverOver
- onDragEnter
- onDragLeave
- onDrop

To just use this dropzone an indicator for a container of drop-zones (such as a list of DragDropCardContainers) pass TRUE to the dropsDisabled prop
*/

export const ItemTypes = {
  CARD: 'draggable_card'
};

//Functions to implement the drop:
const cardDropTarget = {
  hover(props, monitor, component) {
    if (monitor.isOver({ shallow: true }) && props.onHoverOver && !props.dropsDisabled) {
      props.onHoverOver({dropZoneProps: {...props}, draggedItemProps: {...monitor.getItem()}});
    }
  },
  drop(props, monitor) {
    if (monitor.isOver({ shallow: true }) && props.onDrop && !props.dropsDisabled) {
      props.onDrop({dropZoneProps: {...props}, draggedItemProps: {...monitor.getItem()}});
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
    canDrop: monitor.canDrop(),
    draggedItem: monitor.getItem()
  };
}

class CardDropZone extends React.Component {

  static propTypes = {
    isOver: PropTypes.bool,
    onDragEnter: PropTypes.func,
    onDragLeave: PropTypes.func,
    connectDropTarget: PropTypes.func,
    canDrop: PropTypes.bool,
    dropClassName: PropTypes.string,
    style: PropTypes.object,
    draggedItem: PropTypes.object,
    children: PropTypes.node
  }

  componentDidUpdate = prevProps => {
    const {
      isOver,
      onDragEnter,
      onDragLeave,
    } = this.props;
    if (prevProps.isOver != isOver) {
      if (isOver && prevProps.onDragEnter) {
        onDragEnter({
          dropZoneProps: { ...this.props },
          draggedItemProps: { ...prevProps.draggedItem }
        });
      } else if (!isOver && prevProps.onDragLeave) {
        onDragLeave({
          dropZoneProps: { ...this.props },
          draggedItemProps: { ...prevProps.draggedItem }
        });
      }
    }
  }

  render() {
    const { connectDropTarget, isOver, canDrop, dropClassName, style, draggedItem } = this.props;
    const dropZoneClasses = classNames(dropClassName, {
      'highlight-drop-zone': draggedItem,
      'cant-drop': (!canDrop && isOver),
      'is-over': isOver
    });

    return connectDropTarget(
      <div className={dropZoneClasses} style={style}>
        {this.props.children}
      </div>
    );
  }
}


export default DropTarget(ItemTypes.CARD, cardDropTarget, dropCollect)(CardDropZone);
