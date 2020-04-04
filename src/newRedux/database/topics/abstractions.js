import { moveTopic, moveOrCopyTopicInOrToTopic, removeTopic } from './thunks';
import { setSelectTopicDestinationModalOpen } from 'Src/newRedux/interface/modals/actions';
import { stateMappings } from 'Src/newRedux/stateMappings';

//a convenience function to call 'moveTopic' directly with GenericDragDropListing onDrop arguments.
//NOTE: requires the dropZoneProps to include { topicId: topicId } so that we update the correct topic order
export const moveTopicFromDragAndDrop = ({ droppedItemProps, dropZoneProps, itemOrder }) => (dispatch, getState) => {
  const movedTopic = droppedItemProps.item;
  const parentTopicId = dropZoneProps.topicId;
  const mappedItemOrder = itemOrder.map( item => item.id );
  const indexOfMovedTopicInItemOrder = mappedItemOrder.indexOf( movedTopic.id );
  const beforeTopicId = mappedItemOrder[ indexOfMovedTopicInItemOrder + 1 ];
  const afterTopicId = beforeTopicId ? null : mappedItemOrder[ indexOfMovedTopicInItemOrder - 1 ];

  dispatch( moveTopic({
    afterTopicId,
    beforeTopicId,
    parentTopicId,
    topic: movedTopic,
  }));
}


export const moveOrCopyTopicInOrToTopicFromDragAndDrop = ({ droppedItemProps, dropZoneProps, itemOrder }) => (dispatch, getState) => {
  const movedTopic = droppedItemProps.item;
  const mappedItemOrder = itemOrder.map( item => item.id );
  const indexOfMovedTopicInItemOrder = mappedItemOrder.indexOf( movedTopic.id );
  const beforeTopicId = mappedItemOrder[ indexOfMovedTopicInItemOrder + 1 ];
  const afterTopicId = beforeTopicId ? null : mappedItemOrder[ indexOfMovedTopicInItemOrder - 1 ];

  dispatch( moveOrCopyTopicInOrToTopic({
    afterTopicId,
    beforeTopicId,
    topic: movedTopic,
    fromTopicId:  droppedItemProps.origin.topicId || null,
    toTopicId: dropZoneProps.topicId || null
  }));
}

export const initiateArchiveTopicDialog = () => {
  throw new Error('method is not defined');
};

export const initiateDeleteTopicDialog = topicId => dispatch => {
  vex.dialog.open({
    message: 'Delete content or move?',
    buttons: [
      {
        ...vex.dialog.buttons.NO,
        text: 'Cancel'
      },
      {
        ...vex.dialog.buttons.YES,
        text: 'Move',
        click: () =>
          dispatch(setSelectTopicDestinationModalOpen(topicId, true, 'delete'))
      },
      {
        ...vex.dialog.buttons.YES,
        text: 'Delete',
        click: () => dispatch(removeTopic(topicId))
      }
    ]
  });
};

export const initiateMoveTopicDialog = topicId => {
  return setSelectTopicDestinationModalOpen(topicId, true, 'move');
};
