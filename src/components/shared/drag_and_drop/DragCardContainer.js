import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';

//A simple container for a draggable card.
//Pass the card/tip object into the 'card' prop, and an object of other details to 'draggedItemProps'
//Give the container a class that contains a subclass 'is-dragging' to change the style of the dragged object

export const ItemTypes = {
  CARD: 'draggable_card'
};

// Functions to implement the drag:
const cardDragSource = {
  beginDrag(props) {
    return {...props.draggedItemProps, card: props.card};
  },
  endDrag(props, monitor, component) {
    if(!monitor.didDrop()){
      props.onDropElsewhere(props)
    }
  }
};

function dragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
};


class DragCardContainer extends React.Component {

  render() {
    const { connectDragSource, isDragging, cardIsDragging, dragClassName, style } = this.props;

    const dragContainerClasses = classNames(dragClassName, {
      'is-dragging': (isDragging || cardIsDragging),
    });

    return connectDragSource(
      <div className={dragContainerClasses} style={style}>
        {this.props.children}
      </div>
    );
  }
};

DragCardContainer.propTypes = {
  dragClassName: PropTypes.string, //a classname for styling the container (optional)
  style: PropTypes.object, //a style object for styling the container (optional)
  cardIsDragging: PropTypes.bool //pass an override (used when the card is moved to another container so is remounted there)
}

export default DragSource(ItemTypes.CARD, cardDragSource, dragCollect)(DragCardContainer);
