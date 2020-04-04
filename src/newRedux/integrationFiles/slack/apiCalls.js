import { ApiRequest } from 'Lib/ApiRequest';

export const slackCheck = async () =>
  ApiRequest.request({
    method: 'GET',
    url: 'slack'
  });

export const slackAdd = async (code, redirectUri, inviteAllusers) =>
  ApiRequest.request({
    method: 'POST',
    url: 'slack/auth',
    data: { code, redirectUri, inviteAllusers },
  });

export const slackLogin = async (code, redirectUri) =>
  ApiRequest.request({
    method: 'POST',
    url: 'slack/login',
    data: { code, redirectUri },
  });

export const slackDisconnect = async (id) =>
  ApiRequest.request({
    method: 'POST',
    url: 'slack/disconnect_from_slack',
    data: { id }
  });

export const slackDomainData = async (id) =>
  ApiRequest.request({
    method: 'POST',
    url: 'slack/get_slack_data',
    data: { teamId: id  },
  });

export const createSlackConnection = async (connection) =>
  ApiRequest.request({
    method: 'POST',
    url: 'slack/create_topic_connection',
    data: { connection },
  });

export const updateSlackConnection = async (connection) =>
  ApiRequest.request({
    method: 'POST',
    url: 'slack/update_topic_connection',
    data: { connection },
  });

export const deleteSlackConnection = async (connection) =>
  ApiRequest.request({
    method: 'POST',
    url: 'slack/remove_topic_connection',
    data: { connection },
  });

export default {
  slackCheck,
  slackAdd,
  slackLogin,
  slackDisconnect,
  slackDomainData,
  createSlackConnection,
  updateSlackConnection,
  deleteSlackConnection,
};
