import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { getSortedFilteredCardsByTopic } from 'Src/newRedux/database/cards/selectors';
import { moveOrCopyCardInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/cards/abstractions';
import { nestCardUnderCard } from 'Src/newRedux/database/cards/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';

class GenericCard extends PureComponent {
  constructor(props) {
    super(props);
  }

  handleDropCard = ({ droppedItemProps, dropZoneProps, itemOrder }) => {
    this.props.nestCardUnderCard({
      nestedCard: droppedItemProps.item,
      parentCard: this.props.cards[dropZoneProps.cardId],
      fromTopicId: droppedItemProps.origin.topicId,
      toTopicId: dropZoneProps.topicId,
      itemOrder
    });
  };

  handleNestedCardsCaretClick = () => {
    this.setState({ showNestedCards: !this.state.showNestedCards });
  };

  showAsNestable = attrs => {
    const { card } = this.props;
    if (card.id !== attrs.draggedItemProps.item.id) {
      card.relationships.nested_tips.data.push(attrs.draggedItemProps.item.id);
      this.setState({
        card: card,
        showNestedCards: true,
        draggedCard: attrs.draggedItemProps.item
      });
    }
  };

  dontShowAsNestable = attrs => {
    const { card } = this.props;
    if (card.id !== attrs.draggedItemProps.item.id) {
      const nested = card.relationships.nested_tips.data.filter(
        id => id !== attrs.draggedItemProps.item.id
      );
      card.relationships.nested_tips.data = nested;
      this.setState({ card: card, showNestedCards: false, draggedCard: null });
    }
  };

  handleNestCard = itemProps => {
    const { card } = this.props;
    const dragged = itemProps.draggedItemProps;
    if (dragged.item.id === card.id) {
      return;
    }

    this.props.nestCardUnderCard({
      nestedCard: dragged.item,
      parentCard: card,
      fromTopicId: dragged.origin.topicId,
      toTopicId: dragged.origin.topicId,
      itemOrder: card.relationships.nested_tips.data
    });
    card.relationships.nested_tips.data.push(dragged.item.id);
    this.setState({ card: card, showNestedCards: true });
  };

  render() {
    return;
  }
}

export default GenericCard;
