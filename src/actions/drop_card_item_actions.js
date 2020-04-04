import AppDispatcher from '../dispatchers/app_dispatcher';

const DropCardItemActions = {
  addItemIntoTopic: (item, fromTopic, toTopic) =>
    AppDispatcher.dispatch({
      actionType: 'ADD_ITEM_INTO_TOPIC',
      item,
      fromTopic,
      toTopic
    }),
  moveItemFromTopic: (item, fromTopic, toTopic) =>
    AppDispatcher.dispatch({
      actionType: 'MOVE_ITEM_FROM_TOPIC',
      item,
      fromTopic,
      toTopic
    }),
  dropItemOptionType: (item, type, fromTopic, toTopic) =>
    AppDispatcher.dispatch({
      actionType: 'DROP_ITEM_OPTION_TYPE',
      item,
      type,
      fromTopic,
      toTopic
    })
};

export default DropCardItemActions;
