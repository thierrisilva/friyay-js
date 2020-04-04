//This file holds the API calls that hit the /tips route for DRY purposes
import { ApiRequest } from 'Lib/ApiRequest';

export const deleteTopic = async topicId =>
  ApiRequest.request({
    method: 'DELETE',
    url: `topics/${topicId}`
  });

export const deleteTopicAndMoveContent = async (topicId, destinationTopicId) =>
  ApiRequest.request({
    method: 'DELETE',
    url: `topics/${topicId}`,
    data: {
      data: {
        alternate_topic_id: destinationTopicId,
        move_tip_ids: 'all'
      }
    }
  });

export const fetchTopic = async ({ topicSlug, topicId }) =>
  ApiRequest.request({
    method: 'GET',
    url: `topics/${topicSlug ? topicSlug : topicId}`
  });

export const fetchTopics = async fetchQuery =>
  ApiRequest.request({
    method: 'GET',
    // url: `topics?with_permissions=true${fetchQuery}&with_details=true`
    url: `topics?with_details=true${fetchQuery}`
  });

export const patchTopic = async topic => {
  return ApiRequest.request({
    method: 'PATCH',
    url: `topics/${topic.id}`,
    data: {
      data: topic
    }
  });
};

export const postActionOnTopic = async ({ topicId, action, data }) =>
  ApiRequest.request({
    method: 'POST',
    url: `topics/${topicId}/${action}`,
    data
  });

export const postTopic = async newTopic =>
  ApiRequest.request({
    method: 'POST',
    url: `topics`,
    data: {
      data: {
        type: 'topics',
        ...newTopic
      }
    }
  });

export const postTopicDesign = async newTopicDesign =>
  ApiRequest.request({
    method: 'POST',
    url: 'topic_designs',
    data: {
      data: { attributes: newTopicDesign }
    }
  });

export const updateTopicDesign = async updateDesign =>
  ApiRequest.request({
    method: 'PUT',
    url: `topic_designs/${updateDesign.id}`,
    data: {
      data: { attributes: updateDesign }
    }
  });

export const deleteTopicDesign = async id =>
  ApiRequest.request({
    method: 'DELETE',
    url: `topic_designs/${id}`
  });

export const activateDesign = async id =>
  ApiRequest.request({
    method: 'POST',
    url: `topic_designs/${id}/activate_topic_design_for_user`
  });

export const defaultDesign = async ({ design_id, topic_id }) =>
  ApiRequest.request({
    method: 'POST',
    url: `topics/${topic_id}/assign_default_design`,
    data: {
      data: {
        attributes: {
          default_design_id: design_id
        }
      }
    }
  });

export default {
  defaultDesign,
  activateDesign,
  deleteTopicDesign,
  updateTopicDesign,
  postTopicDesign,
  deleteTopic,
  deleteTopicAndMoveContent,
  fetchTopic,
  fetchTopics,
  patchTopic,
  postActionOnTopic,
  postTopic
};
