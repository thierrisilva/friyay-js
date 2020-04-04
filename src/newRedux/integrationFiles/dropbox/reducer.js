import {
  DROPBOX_LIST_FILES,
  DROPBOX_LIST_FILES_DONE,
  DROPBOX_ERROR,
  DROPBOX_DISCONNECT_DONE,
} from './actions';

const defaultState = {
  folderID:       '',
  files:          [],
  nextPageToken:  null,
  error:          null,
  sendingRequest: false,
};

const dropboxReducer = (state = defaultState, action) => {
  switch (action.type) {
    case DROPBOX_LIST_FILES:
      return { ...state, folderID: action.folderID, sendingRequest: true };

    case DROPBOX_LIST_FILES_DONE:
      return { ...state, files: action.files, sendingRequest: false };

    case DROPBOX_ERROR:
      return { ...state, error: action.error };

    case DROPBOX_DISCONNECT_DONE:
      return { ...state, files: [] };

    default:
      return state;
  }
};

export default dropboxReducer;
