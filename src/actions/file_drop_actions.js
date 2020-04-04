import SubDispatcher from '../dispatchers/sub_dispatcher';

const FileDropActions = {
  dropFileToTip(options) {
    SubDispatcher.dispatch({
      type: 'DROP_FILE_TO_TARGET',
      source:      options.source,
      target:      options.target,
      method:      options.method,
      accessToken: options.accessToken
    });
  },

  clearItemUploadedFile(itemType, itemID) {
    SubDispatcher.dispatch({
      type: 'CLEAR_ITEM_UPLOADED_FILE',
      itemType,
      itemID
    });
  },

  appendLinks: function(itemType, itemID, appendedBody) {
    SubDispatcher.dispatch({
      actionType: 'UPDATE_ITEM_ATTRIBUTES',
      itemType,
      itemID,
      appendedBody
    });
  },
};

export default FileDropActions;
