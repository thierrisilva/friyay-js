import { ApiRequest } from 'Lib/ApiRequest';

export const fetchBot = async () =>
  ApiRequest.request({
    method: 'GET',
    url: 'tiphive_bot/get_tiphive_bot_data',
  });

export const postCommands = async (command) =>
  ApiRequest.request({
    method: 'POST',
    url: 'tiphive_bot/get_bot_data_using_command',
    data: command
  });

export const fetchUsersAndTopics = async (query) =>
  ApiRequest.request({
    method: 'POST',
    url: 'tiphive_bot/get_users_and_topics',
    data: { query },
  });

export default {
  fetchBot,
  fetchUsersAndTopics,
  postCommands,
};
