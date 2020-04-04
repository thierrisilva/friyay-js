export const SET_NEW_CONNECTION =  'SET_NEW_CONNECTION';
export const SET_SELETECTED_WORKSPACE = 'SET_SELETECTED_WORKSPACE';
export const SET_SLACK_WORKSPACE =  'SET_SLACK_WORKSPACE';
export const UPDATE_SLACK_CONNECTIONS =  'UPDATE_SLACK_CONNECTIONS';
export const SET_SLACK_PANEL_VIEW = 'SET_SLACK_PANEL_VIEW';

export const setNewConnection = payload => ({ type: SET_NEW_CONNECTION, payload });
export const setSelectedWorkspace = workspaceId => ({ type: SET_SELETECTED_WORKSPACE, workspaceId });
export const setSlackPanelView = view => ({ type: SET_SLACK_PANEL_VIEW, view });
export const setSlackWorkSpace = payload => ({ type: SET_SLACK_WORKSPACE, payload });
export const updateSlackConnections = payload => ({ type: UPDATE_SLACK_CONNECTIONS, payload });
