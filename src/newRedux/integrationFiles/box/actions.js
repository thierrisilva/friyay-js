export const BOX_LIST_FILES = 'BOX_LIST_FILES';
export const BOX_LIST_FILES_DONE = 'BOX_LIST_FILES_DONE';
export const BOX_DISCONNECT = 'BOX_DISCONNECT';
export const BOX_DISCONNECT_DONE = 'BOX_DISCONNECT_DONE';
export const BOX_ERROR = 'BOX_ERROR';

export const boxListFiles = folderID => ({ type: BOX_LIST_FILES, folderID });
export const boxListFilesDone = files => ({ type: BOX_LIST_FILES_DONE, files });
export const boxError = error => ({ type: BOX_ERROR, error });
export const boxDisconnectDone = () => ({ type: BOX_DISCONNECT_DONE });
