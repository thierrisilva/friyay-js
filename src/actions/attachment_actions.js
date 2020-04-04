import AppDispatcher from '../dispatchers/app_dispatcher';

var AttachmentActions = {
  loadAttachments: function(attachmentIDs) {
    AppDispatcher.dispatch({
      actionType: 'LOAD_ATTACHMENTS',
      attachmentIDs: attachmentIDs
    });
  }
};

export default AttachmentActions;
