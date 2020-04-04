import {
  SET_SLACK_WORKSPACE,
  SET_SELETECTED_WORKSPACE,
  SET_NEW_CONNECTION,
  UPDATE_SLACK_CONNECTIONS,
  SET_SLACK_PANEL_VIEW,
} from './actions';

const defaultState = {
  teams: [],
  hasteam: false,
  hasSlack: false,
  isLoading: false,
  workspace: {},
  selectedWorkspace: 'select',
  currentView: '',
};

const slackReducer = (state = defaultState, action) => {
  switch(action.type) {

    case SET_SLACK_WORKSPACE:
      return { ...state, workspace: action.payload };

    case SET_NEW_CONNECTION: {
      const newState = { ...state };
      newState.workspace.slack_connections.push(action.payload.topic_connection);
      return newState;
    }

    case UPDATE_SLACK_CONNECTIONS: {
      const newState = { ...state };
      newState.workspace.slack_connections = newState.workspace.slack_connections.filter(item => `${action.payload.topic_connection.id}` !== `${item.id}`);
      if (!action.payload.remove) newState.workspace.slack_connections.push(action.payload.topic_connection);
      return newState;
    }

    case SET_SELETECTED_WORKSPACE: {
      return { ...state, selectedWorkspace: action.workspaceId }
    }

    case SET_SLACK_PANEL_VIEW:
      return { ...state, currentView: action.view };

    default:
      return state;
  }
};

export default slackReducer;
