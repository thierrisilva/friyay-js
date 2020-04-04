import {
  GOOGLE_LIST_FILES,
  GOOGLE_LIST_FILES_DONE,
  GOOGLE_DISCONNECT_DONE,
  GOOGLE_ERROR,
} from './actions';

const defaultState = {
  folderID:       0,
  files:          [],
  nextPageToken:  null,
  newAccessToken: null,
  error:          null,
  sendingRequest: false,
};

const driveReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GOOGLE_LIST_FILES:
      return { ...state, folderID: action.folderID, sendingRequest: true };

    case GOOGLE_LIST_FILES_DONE:
      return {
        ...state,
        files: action.files || [],
        sendingRequest: false,
        nextPageToken: action.nextPageToken
      };

    case GOOGLE_DISCONNECT_DONE:
      return { ...state, files: [] };

    case GOOGLE_ERROR:
      return { ...state, error: action.error };

    default:
      return state;
  }
};

export default driveReducer;
