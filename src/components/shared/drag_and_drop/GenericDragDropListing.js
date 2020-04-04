import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import { stateMappings } from 'Src/newRedux/stateMappings';

import ErrorBoundary from 'Components/shared/errors/ErrorBoundary';
import GenericDragDropContainer from 'Components/shared/drag_and_drop/GenericDragDropContainer';
import GenericDragContainer from 'Components/shared/drag_and_drop/GenericDragContainer';
import GenericDropZone from 'Components/shared/drag_and_drop/GenericDropZone';
import { dragItemTypes } from './dragTypeEnum';

class GenericDragDropListing extends Component {
  static propTypes = {
    itemList: PropTypes.array,
    ctrlKeyDown: PropTypes.bool,
    parentListDragLeaveHandlers: PropTypes.array,
    dropZoneProps: PropTypes.object,
    onDropItem: PropTypes.func,
    children: PropTypes.node,
    dragClassName: PropTypes.string,
    dragPreview: PropTypes.func,
    dropClassName: PropTypes.string,
    keyExtractor: PropTypes.func,
    itemContainerClassName: PropTypes.string,
    itemType: PropTypes.oneOf(Object.values(dragItemTypes)),
    renderItem: PropTypes.func,
    draggedItemProps: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.uuid = Math.random();
    this.state = {
      itemList: props.itemList,
      dragItemId: null,
      dragItemIsElsewhere: false
    };
  }

  componentDidUpdate = prevProps => {
    const { itemList, ctrlKeyDown } = this.props;
    //do a deep comparison as props might get updated on rerender of parents even when nothing changed
    if (!isEqual(prevProps.itemList, itemList)) {
      this.setState({ itemList: itemList });
    }
    if (prevProps.ctrlKeyDown != ctrlKeyDown) {
      this.setState({ dragItemIsElsewhere: !ctrlKeyDown });
    }
  };

  handleDragLeave = ({ draggedItemProps, dropZoneProps }) => {
    //Remove the item from this particular list when dragged out
    const dragItemId = draggedItemProps.item.id;
    const newList = this.props.itemList.filter(item => item.id !== dragItemId);
    if (dragItemId) {
      this.setState({ itemList: newList, dragItemIsElsewhere: true });
    }
  };

  handleDragOver = ({ draggedItemProps, dropZoneProps }) => {
    //When an item is dragged over an existing item, update state to put the dragged item into the array at the index of the dragged-over item:
    const draggedItem = draggedItemProps.item;
    const draggedOverItem = dropZoneProps.item;

    if (this.props.parentListDragLeaveHandlers) {
      this.props.parentListDragLeaveHandlers.forEach(handler =>
        handler({ draggedItemProps, dropZoneProps })
      );
    }

    if (draggedOverItem && draggedOverItem.id !== draggedItem.id) {
      const draggedOverIndex = this.state.itemList.indexOf(draggedOverItem);
      const listWithDraggedItemRemoved = this.state.itemList.filter(
        item => item.id !== draggedItem.id
      );
      listWithDraggedItemRemoved.splice(draggedOverIndex, 0, draggedItem);
      this.setState({
        itemList: listWithDraggedItemRemoved,
        dragItemId: draggedItem.id,
        dragItemIsElsewhere: false
      });
    }
  };

  handleDragOverEmptyList = ({ draggedItemProps, dropZoneProps }) => {
    //When the list is empty, we don't have to worry about at what index to add it, we just add it:
    if (this.props.parentListDragLeaveHandlers) {
      this.props.parentListDragLeaveHandlers.forEach(handler =>
        handler({ draggedItemProps, dropZoneProps })
      );
    }
    if (this.state.itemList.length === 0) {
      const draggedItem = draggedItemProps.item;
      this.setState({
        itemList: [draggedItem],
        dragItemId: draggedItem.id,
        dragItemIsElsewhere: false
      });
    }
  };

  handleDrop = ({ draggedItemProps }) => {
    this.props.onDropItem({
      droppedItemProps: draggedItemProps,
      dropZoneProps: this.props.dropZoneProps,
      itemOrder: this.state.itemList
    });
    this.setState({ dragItemId: null, dragItemIsElsewhere: false });
  };

  handleDropElsewhere = () => {
    //When an item is dropped somewhere, reset the list
    const { itemList, dragItemId } = this.state;
    this.setState({
      itemList: this.props.itemList,
      dragItemId: null,
      dragItemIsElsewhere: false
    });
  };

  render() {
    const {
      children,
      dragClassName,
      dragPreview,
      dropClassName,
      keyExtractor,
      itemContainerClassName,
      itemType,
      renderItem,
      draggedItemProps,
      headerItem,
      parentListDragLeaveHandlers = []
    } = this.props;
    const { dragItemId, itemList, dragItemIsElsewhere } = this.state;

    //we build an array of drag-leave handlers of any parent listings, so that when dragging into a child listing, we can call drag-leave from the parent
    const dragLeaveHandlers = [
      ...parentListDragLeaveHandlers,
      this.handleDragLeave
    ];

    return (
      <GenericDropZone
        dropClassName={dropClassName}
        itemType={itemType}
        onDragEnter={this.handleDragOverEmptyList}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        {headerItem}

        {itemList.map((item, index) => (
          <ErrorBoundary key={keyExtractor ? keyExtractor(item) : index}>
            <div
              className={cx(itemContainerClassName || 'item-container', {
                'hide-dragged-item':
                  item.id == dragItemId && dragItemIsElsewhere
              })}
              key={keyExtractor ? keyExtractor(item) : index}
            >
              <GenericDragDropContainer
                draggedItemProps={draggedItemProps}
                dragClassName={dragClassName}
                dropClassName={dragClassName}
                dropZoneProps={{ topicId: '0' }}
                dragPreview={dragPreview ? dragPreview(item) : renderItem(item)}
                item={item}
                itemIsDragging={item.id === dragItemId}
                itemType={itemType}
                onDragEnter={this.handleDragOver}
                onDragLeave={this.handleTest}
                onDrop={this.handleDrop}
                onDropElsewhere={this.handleDropElsewhere}
              >
                {renderItem(item, dragLeaveHandlers, index)}
              </GenericDragDropContainer>
            </div>
          </ErrorBoundary>
        ))}
        {children}
      </GenericDropZone>
    );
  }
}

const mapState = (state, props) => ({
  ctrlKeyDown: stateMappings(state).utilities.ctrlKeyDown
});

export default connect(mapState)(GenericDragDropListing);
