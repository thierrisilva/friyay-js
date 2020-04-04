import AppDispatcher from '../dispatchers/app_dispatcher';

var LabelActions = {
  loadAll: function() {
    AppDispatcher.dispatch({
      actionType: 'LOAD_LABELS'
    });
  },

  createLabel: function(labelName, labelKind, labelColorIndex) {
    AppDispatcher.dispatch({
      actionType: 'CREATE_LABEL',
      labelName: labelName,
      labelKind: labelKind,
      labelColorIndex: labelColorIndex
    });
  },

  updateLabel: function(labelID, labelName, labelKind, labelColorIndex, itemID, itemType) {
    AppDispatcher.dispatch({
      actionType: 'UPDATE_LABEL',
      labelID: labelID,
      labelName: labelName,
      labelKind: labelKind,
      labelColorIndex: labelColorIndex,
      itemID: itemID,
      itemType: itemType
    });
  },

  deleteLabel: function(labelID, itemID, itemType) {
    AppDispatcher.dispatch({
      actionType: 'DELETE_LABEL',
      labelID: labelID,
      itemID: itemID,
      itemType: itemType
    });
  },

  assignLabel: function(labelID, itemID, itemType) {
    AppDispatcher.dispatch({
      actionType: 'ASSIGN_LABEL',
      labelID: labelID,
      itemID: itemID,
      itemType: itemType
    });
  },

  removeLabel: function(labelID, itemID, itemType) {
    AppDispatcher.dispatch({
      actionType: 'REMOVE_LABEL',
      labelID: labelID,
      itemID: itemID,
      itemType: itemType
    });
  },

  filterTipByLabel: function (label, isLabelSelected) {
    AppDispatcher.dispatch({
      actionType: 'FILTER_TIP_BY_LABEL',
      label,
      isLabelSelected
    });
  },

};

export default LabelActions;
