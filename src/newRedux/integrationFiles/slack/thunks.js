import api from './apiCalls';
import Auth from 'Lib/auth';
import orderBy from 'lodash/orderBy';
import { success, failure } from 'Utils/toast';
import Analytics from 'Lib/analytics';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import Cookies from 'js-cookie';
import {
  slackTeamSuccess,
  setSlackWorkSpace,
  setNewConnection,
  updateSlackConnections,
  setSelectedWorkspace,
  setSlackPanelView
} from './actions';

export const getSlackDomainData = id => async dispatch => {
  try {
    const slackAccessToken = Cookies.set(
      `${window.currentDomainName}-slackAccessToken`
    );
    if (slackAccessToken) {
      dispatch(setSlackPanelView('workspaces'));
    } else {
      dispatch(setSlackPanelView('loading'));
    }

    id = id === 'select' ? null : id;

    const { data } = await api.slackDomainData(id);

    if (!slackAccessToken && data && data.slack_workspace.length > 0) {
      data.topics = orderBy(data.topics, t => t.title, 'asc');

      dispatch(setSlackPanelView('workspaces'));
      Cookies.set(
        `${window.currentDomainName}-slackAccessToken`,
        data.slack_workspace[0].access_token,
        {
          domain: `.${window.APP_DOMAIN}`
        }
      );
    } else if (data.slack_workspace && data.slack_workspace.length == 0) {
      dispatch(setSlackPanelView('connect'));
    }
    dispatch(setSlackWorkSpace(data));
    return data;
  } catch (err) {
    failure('could not get workspace data');
  }
};

export const createNewSlackConnection = connection => async dispatch => {
  try {
    const {
      data: { data: topic_connection }
    } = await api.createSlackConnection(connection);
    dispatch(setNewConnection(topic_connection));
    success('New connection created!');
    return topic_connection;
  } catch (err) {
    failure('unable to create conection');
  }
};

export const updateSlackConnection = connection => async dispatch => {
  try {
    const {
      data: { data: topic_connection }
    } = await api.updateSlackConnection(connection);
    dispatch(
      updateSlackConnections({
        topic_connection: topic_connection.topic_connection,
        remove: false
      })
    );
    success('Slack connection updated!');
    return topic_connection.topic_connection;
  } catch (err) {
    failure('could not update slack connection!');
  }
};

export const deleteSlackConnection = connection => async dispatch => {
  try {
    const response = await api.deleteSlackConnection(connection);
    if (response.statusText === 'OK') {
      dispatch(
        updateSlackConnections({ topic_connection: connection, remove: true })
      );
    }
  } catch (err) {
    failure('could delete slack connection!');
  }
};

export const slackCheck = () => async dispatch => {
  try {
    const {
      data: { data }
    } = await api.slackCheck();
    dispatch(slackTeamSuccess(data[0]));
  } catch (err) {
    console.log('workspace not connected with slack');
  }
};

export const slackAdd = (
  code,
  redirectUri,
  inviteAllusers
) => async dispatch => {
  // need work after API
  const {
    data: { data: responseData }
  } = await api.slackAdd(code, redirectUri, inviteAllusers);

  if (responseData.access_token) {
    Cookies.set(
      `${window.currentDomainName}-slackAccessToken`,
      responseData.access_token,
      {
        domain: `.${window.APP_DOMAIN}`,
        expires: responseData.expires
      }
    );
    const teamName = responseData.team_name;
    success(`Friyay integrated with ${teamName} slack`);
    dispatch(setSelectedWorkspace(responseData.team_id));
    return responseData;
  } else {
    failure('integration failed');
  }
};

export const slackLogin = (code, redirectUri) => async () => {
  try {
    const {
      data: { data: user }
    } = await api.slackLogin(code, redirectUri);
    const loginSuccess = status => {
      if (status.isLogged) {
        Analytics.identify(window.currentUser);
        Analytics.track('Logged In');
        window.location.href = '/';
      }
    };
    if (user.id) {
      Auth.setCookie('authToken', user.attributes.auth_token);
      Auth.setUser(user);
      Auth.setNotificationSettings(user);
      Auth.processAuthToken(loginSuccess);
    } else {
      Auth.sweepUserData();
    }
    success('Logged in with slack');
  } catch (err) {
    failure('unable to login with slack');
  }
};

export const disconnectSlack = id => async dispatch => {
  dispatch(setSelectedWorkspace('select'));
  await api.slackDisconnect(id);
  success('disconnected with slack');
  Auth.deleteCookie(`${window.currentDomainName}-slackAccessToken`);
  dispatch(setRightMenuOpenForMenu('Integrations'));
};
