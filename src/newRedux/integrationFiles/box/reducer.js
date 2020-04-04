import {
  BOX_LIST_FILES,
  BOX_LIST_FILES_DONE,
  BOX_ERROR,
  BOX_DISCONNECT_DONE,
} from './actions';

const defaultState = {
  folderID:       0,
  files:          [],
  nextPageToken:  null,
  newAccessToken: null,
  error:          null,
  sendingRequest: false,
};

const boxReducer = (state = defaultState, action) => {
  switch (action.type) {
    case BOX_LIST_FILES:
      return { ...state, folderID: action.folderID, sendingRequest: true };

    case BOX_LIST_FILES_DONE:
      return { ...state, files: action.files, sendingRequest: false, nextPageToken: action.nextPageToken };

    case BOX_ERROR:
      return { ...state, error: action.error };

    case BOX_DISCONNECT_DONE:
      return { ...state, files: [] };

    default:
      return state;
  }
};

export default boxReducer;
