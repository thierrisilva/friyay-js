import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { withRouter } from 'react-router';

import GridItem from './grid_item';
import SmallGridItem from './small_grid_item';
import ListItem from './list_item';
import WikiItem from './wiki_item';

import ItemTypes from '../../../lib/item_types';
import { VIEWS_ENUM } from 'Enums';

const cardSource = {
  beginDrag: ({ index, id, item, topic, tipViewMode }) => ({
    index,
    id,
    item,
    topic,
    viewType: tipViewMode
  })
};

const itemTarget = {
  hover: (props, monitor) => {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    const { topic, moveItem } = props;

    // Check if it has topic props
    if (!topic) {
      return;
    }

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    moveItem(dragIndex, hoverIndex, monitor.getItem());

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },

  drop(props, monitor) {
    const dragItem = monitor.getItem();
    const tip = dragItem.item;
    const dragIndex = dragItem.index;
    const { topic, dropItem } = props;

    // Check if it has topic props
    if (!topic) {
      return;
    }

    // Time to actually perform the action
    dropItem(tip, dragIndex, topic, dragItem.topic);
  }
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
});

const collectTarget = connect => ({
  connectDropTarget: connect.dropTarget()
});

class ItemsContainerItem extends Component {
  static propTypes = {
    tipViewMode: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    group: PropTypes.object,
    handleItemClick: PropTypes.func.isRequired,
    onLikeUnlikeClick: PropTypes.func.isRequired,
    onStarUnstarClick: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    archiveItem: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    moveItem: PropTypes.func,
    dropItem: PropTypes.func,
    location: PropTypes.object.isRequired
  };

  componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true
    });
  }

  render() {
    const { props } = this;
    const {
      tipViewMode,
      location: { pathname },
      item,
      isDragging,
      connectDragSource,
      connectDropTarget
    } = props;

    let itemCard = null;
    const isTopicPage = pathname.includes('/yays/');
    if (tipViewMode === VIEWS_ENUM.LIST || tipViewMode === VIEWS_ENUM.TASK) {
      const itemClass = classNames({
        'item-card list-item': true,
        [`color-${item.attributes.color_index}`]: true,
        'is-dragging': isDragging || item.isDragging
      });

      itemCard = (
        <div className={itemClass} id={`item-${item.id}`}>
          <ListItem
            {...props}
            key={`item-${item.id}`}
            data-id={item.id}
            data-type={item.type}
          />
        </div>
      );
    } else if (tipViewMode === VIEWS_ENUM.SMALL_GRID) {
      const itemClass = classNames({
        'item-card small-list-item': true,
        [`color-${item.attributes.color_index}`]: true,
        'is-dragging': isDragging
      });

      itemCard = (
        <div className={itemClass} id={`item-${item.id}`}>
          <SmallGridItem
            {...props}
            key={`item-${item.id}`}
            data-id={item.id}
            data-type={item.type}
            ref={instance => {
              const node = findDOMNode(instance); // eslint-disable-line
              connectDragSource(connectDropTarget(node));
            }}
          />
        </div>
      );
    } else if (tipViewMode === VIEWS_ENUM.GRID) {
      const itemClass = classNames({
        'panel panel-default grid-item item-card': true,
        [`color-${item.attributes.color_index}`]: true,
        'is-dragging': isDragging
      });

      itemCard = (
        <div className={itemClass} id={`item-${item.id}`}>
          <GridItem
            {...props}
            key={`item-${item.id}`}
            data-id={item.id}
            data-type={item.type}
            ref={instance => {
              const node = findDOMNode(instance); // eslint-disable-line
              connectDragSource(connectDropTarget(node));
            }}
          />
        </div>
      );
    } else if (tipViewMode === VIEWS_ENUM.WIKI) {
      const itemClass = classNames({
        'panel panel-default wiki-item item-card': true,
        [`color-${item.attributes.color_index}`]: true,
        'is-dragging': isDragging
      });

      itemCard = (
        <div className={itemClass} id={`item-${item.id}`}>
          <WikiItem
            {...props}
            key={`item-${item.id}`}
            data-id={item.id}
            data-type={item.type}
            ref={instance => {
              const node = findDOMNode(instance); // eslint-disable-line
              connectDragSource(connectDropTarget(node));
            }}
          />
        </div>
      );
    }

    return isTopicPage
      ? connectDragSource(connectDropTarget(itemCard))
      : itemCard;
  }
}

const dragSource = DragSource(ItemTypes.CARD_ITEM, cardSource, collectSource)(
  withRouter(ItemsContainerItem)
);
const dropTarget = DropTarget(ItemTypes.CARD_ITEM, itemTarget, collectTarget)(
  dragSource
);

export default dropTarget;
