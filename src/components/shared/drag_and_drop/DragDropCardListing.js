import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import without from 'lodash/without';
import isEqual from 'lodash/isEqual';

import DragCardContainer from 'Components/shared/drag_and_drop/DragCardContainer';
import DragDropCardContainer from 'Components/shared/drag_and_drop/DragDropCardContainer';
import CardDropZone from 'Components/shared/drag_and_drop/CardDropZone';

class DragDropCardListing extends Component {

  static propTypes = {
    dragClassName: PropTypes.string,
    dropClassName: PropTypes.string,
    renderCard: PropTypes.func,
    draggedItemProps: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      cardList: props.cardList,
      dragCardId: undefined
    }
  }

  componentDidUpdate = prevProps => {
    //do a deep comparison as props might get updated on rerender of parents even when nothing changed
    const { cardList } = this.props;
    if (!isEqual(prevProps.cardList, cardList)) {
      this.setState({cardList: cardList});
    }
  }

  handleDragLeave = ({ draggedItemProps, dropZoneProps }) => {
    //Remove the card from this particular list when dragged out
    if (this.state.dragCardId) {
      this.setState({
        cardList: [...without(state.cardList, draggedItemProps.card)],
        dragCardId: undefined
      });
    }
  }

  handleDragOver = ({draggedItemProps, dropZoneProps}) => {
    //When a card is dragged over an existing card, update state to put the dragged card into the array at the index of the dragged-over card:
    const draggedCard = draggedItemProps.card;
    const draggedOverCard = dropZoneProps.card;
    const draggedOverIndex = this.state.cardList.indexOf(draggedOverCard);
    const listWithDraggedItemRemoved = [...without(this.state.cardList, draggedCard)];
    listWithDraggedItemRemoved.splice(draggedOverIndex, 0, draggedCard);
    this.setState({
      cardList: listWithDraggedItemRemoved,
      dragCardId: draggedItemProps.card.id
    });
  }

  handleDragOverEmptyList = ({draggedItemProps, dropZoneProps}) => {
    //When the list is empty, we don't have to worry about at what index to add it, we just add it:
    if (this.state.cardList.length === 0) {
      const draggedCard = draggedItemProps.card;
      this.setState(({ cardList: [draggedCard], dragCardId: draggedItemProps.card.id });
    }
  }

  handleDrop = ({draggedItemProps}) => {
    this.setState({ dragCardId: undefined });
    const { onDropCard, dropZoneProps } = this.props;
    onDropCard({
      droppedCardProps: draggedItemProps,
      dropZoneProps: dropZoneProps,
      cardOrder: this.state.cardList
    });
  }

  handleDropElsewhere = () => {
    //When a card is dropped in a no-drop location, return it to its original location.  May later want to change this to delete the card
    this.setState({ cardList: this.props.cardList });
  }


  render() {
    const { dragClassName, dropClassName, renderCard, draggedItemProps } = this.props;

    return (
      <CardDropZone
        dropClassName={dropClassName}
        onDragEnter={this.handleDragOverEmptyList}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
      >
        {this.state.cardList.map(card => (
          <DragDropCardContainer
            key={card.id}
            card={card}
            draggedItemProps={draggedItemProps}
            dragClassName={dragClassName}
            cardIsDragging={card.id === this.state.dragCardId}
            onDragEnter={this.handleDragOver}
            onDrop={this.handleDrop}
            onDropElsewhere={this.handleDropElsewhere}>
            {renderCard(card)}
          </DragDropCardContainer>
        ))}
      </CardDropZone>
    );
  }
}

export default DragDropCardListing;
