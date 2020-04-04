import AppDispatcher from '../dispatchers/app_dispatcher';

var ItemLabelActions = {

  removeLabelFromTip: function (item, labels) {
    AppDispatcher.dispatch({
      actionType: 'LABEL_REMOVE_FROM_TIP',
      item,
      labels
    });
  },

};

export default ItemLabelActions;
