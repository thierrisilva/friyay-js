export const DROPBOX_LIST_FILES = 'DROPBOX_LIST_FILES';
export const DROPBOX_LIST_FILES_DONE = 'DROPBOX_LIST_FILES_DONE';
export const DROPBOX_DISCONNECT = 'DROPBOX_DISCONNECT';
export const DROPBOX_DISCONNECT_DONE = 'DROPBOX_DISCONNECT_DONE';
export const DROPBOX_ERROR = 'DROPBOX_ERROR';

export const dropboxListFiles = folderID => ({ type: DROPBOX_LIST_FILES, folderID });
export const dropboxListFilesDone = files => ({ type: DROPBOX_LIST_FILES_DONE, files });
export const dropboxError = error => ({ type: DROPBOX_ERROR, error });
export const dropboxDisconnectDone = () => ({ type: DROPBOX_DISCONNECT_DONE });
