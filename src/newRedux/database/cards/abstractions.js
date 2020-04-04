import { moveOrCopyCardInOrToTopic } from './thunks';
import { returnBeforeAndAfterCardIdsFromItemOrder } from 'Lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';

//a convenience function to call 'moveOrCopyCardInOrToTopic' directly with GenericDragDropListing onDrop arguments.
//NOTE: requires the dropZoneProps to include { topicId: topicId }
//      and the draggedItemProps to include { origin: { topicId: topicId }}
export const moveOrCopyCardInOrToTopicFromDragAndDrop = ({
  droppedItemProps,
  dropZoneProps,
  itemOrder
}) => (dispatch, getState) => {
  const ctrlKeyDown = stateMappings(getState()).utilities.ctrlKeyDown;
  const movedCard = droppedItemProps.item;
  const {
    afterCardId,
    beforeCardId
  } = returnBeforeAndAfterCardIdsFromItemOrder(movedCard.id, itemOrder);
  const originParentCardId = droppedItemProps.origin.cardId || null;

  dispatch(
    moveOrCopyCardInOrToTopic({
      afterCardId,
      beforeCardId,
      card: movedCard,
      fromTopicId: ctrlKeyDown ? null : droppedItemProps.origin.topicId || null,
      fromParentCardId: originParentCardId,
      toTopicId: dropZoneProps.topicId || 0
    })
  );
};
