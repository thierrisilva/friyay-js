import { failure, success } from 'Utils/toast';
import Cookies from 'js-cookie';
import OAuthClient from 'Src/lib/oauth/oauth_client';
import { updateCard } from 'Src/newRedux/database/cards/thunks';
import mimeTypeChecker from 'mime';
import { createTopic } from 'Src/newRedux/database/topics/thunks';
import { createCard } from 'Src/newRedux/database/cards/thunks';
import { createAttachment } from 'Src/newRedux/database/attachments/thunks';
import { setShowAddCardBottomOverlay } from 'Src/newRedux/interface/modals/actions';
import {
  dropboxListFiles,
  dropboxListFilesDone,
  dropboxError,
  dropboxDisconnectDone,
} from './actions';

export const listFiles = (accessToken, folderID) =>
  async dispatch => {
    dispatch(dropboxListFiles(folderID));
    OAuthClient.post({
      accessToken,
      url: `${window.DROPBOX_APP_URL}/files/list_folder`,
      data: { path: folderID },
      done: (response) => {
        dispatch(dropboxListFilesDone(response.entries));
      },
      fail: (xhr, status, error) => {
        failure('Failed to get drobox files! Try again');
        dispatch(dropboxError(error));
      }
    });
  };

export const disconnect = (accessToken) =>
  async dispatch =>
    OAuthClient.post({
      accessToken,
      url: `${window.DROPBOX_APP_URL}/auth/token/revoke`,
      data: 'null',
      done: () => {
        Cookies.remove('dropboxAccessToken', { domain: `.${window.APP_DOMAIN}` });
        dispatch(dropboxDisconnectDone());
        success('Dropbox disconnect!');
      },
      fail: () => {
        failure('Failed to disconnect dropbox! Try again');
      }
    });

export const addDropboxFileToCard = ({ dropZoneProps, draggedItemProps }) =>
  async dispatch => {
    const {card, method} = dropZoneProps;
    const {fileItem} = draggedItemProps.item;
    const accessToken = Cookies.get('dropboxAccessToken');
    dispatch(setShowAddCardBottomOverlay(false));
    await dispatch(getDropboxFileURL(accessToken, card, fileItem, method));
  };

export const getDropboxFileURL = (accessToken, card, fileItem, method) =>
  async dispatch => {
    if (method === 'link') {
      OAuthClient.post({
        accessToken,
        url: `${window.DROPBOX_APP_URL}/sharing/list_shared_links`,
        data: { path: fileItem.id },
        done: (res) => {
          let links = res.links;
          if (links.length > 0) {
            const source = fileItem;
            const target = links[0];

            dispatch(uploadFile(accessToken, source, target, method, card));
          } else {
            OAuthClient.post({
              accessToken,
              url: `${window.DROPBOX_APP_URL}/sharing/create_shared_link_with_settings`,
              data: { path: fileItem.id },
              done: () => {
              },
              fail: () => {
                failure('Unable to create link for dropbox file');
              }
            });
          }
        },
        fail: () => {
          failure('Unable to find link for dropbox file');
        }
      });
    }

    if (method === 'upload') {
      OAuthClient.post({
        accessToken,
        url: `${window.DROPBOX_APP_URL}/files/get_temporary_link`,
        data: { path: fileItem.id },
        done: (response) => {
          let fileResponse = response.metadata;
          fileResponse['link'] = response.link;
          const source = fileItem;
          const target = fileResponse;

          dispatch(uploadFile(accessToken, source, target, method, card));
        },
        fail: () => {
          failure('Unable to upload file');
        }
      });
    }
  };

export const showDropboxFiles = (accessToken,fileItem) =>
  async () => {
    OAuthClient.post({
      accessToken,
      url: `${window.DROPBOX_APP_URL}/sharing/list_shared_links`,
      data: { path: fileItem.id },
      done: (res) => {
        let links = res.links;
        if (links.length > 0) {
          const target = links[0];
          window.open(target.url, '_blank');
        } else {
          success('Couldn\'t get file link.');
        }
      },
      fail: () => {
        failure('Unable to get file link, try again!');
      }
    });
  };

export const uploadFile = (accessToken, fileItem, fileResponse, method, card) =>
  async (dispatch) => {
    let link     = fileResponse.link; // upload
    let file_url = fileResponse.url; // link

    let mimeType = mimeTypeChecker.lookup(fileResponse.path_lower);

    // is link method...
    if (method === 'link') {

      let itemBody = card.attributes.body || '';

      if (itemBody.includes(file_url) === false) {
        itemBody += ` \n ${file_url} `;
      }

      const attributes = { body: itemBody };

      dispatch(updateCard({ attributes, id: card.id, relationships: {} }));
    } else {
      let uploadData = {
        data: {
          attributes: {
            remote_file_url: link,
            mime_type: mimeType,
          }
        }
      };
      dispatch(uploadFileAndAttachToCard(uploadData, card));
    }
  };

const uploadFileAndAttachToCard = (uploadData, card) =>
  async (dispatch) => {
    uploadData['tip_id'] = card.id;
    uploadData['response_with_tip'] = true;
    dispatch(createAttachment(uploadData));
  };

export const createTopicAndCardsForDropboxFolder = (itemProps) =>
  async dispatch => {
    const { draggedItemProps, dropZoneProps } = itemProps;
    const parentTopic = dropZoneProps.item || {};
    const accessToken = Cookies.get('dropboxAccessToken');
    const folderID = draggedItemProps.item.fileItem.id;

    const newTopic = {
      attributes: { title: draggedItemProps.item.fileItem.name, parent_id: parentTopic.id || null },
      relationships: parentTopic.relationships || {},
    };

    const { data: { data: createdTopic }} = await dispatch( await createTopic(newTopic));

    OAuthClient.post({
      accessToken,
      url: `${window.DROPBOX_APP_URL}/files/list_folder`,
      data: { path: folderID },
      done: (response) => {
        const files = response.entries || [];
        for (const inx in files) {
          if (files[inx]['.tag'].includes('folder')) {
            const newSubTopic = {
              attributes: { title: files[inx].name, parent_id: createdTopic.id },
              relationships: { abilities: createdTopic.relationships.abilities },
            };
            dispatch(createTopic(newSubTopic));
          } else {
            const attributes = { title: files[inx].name };
            const relationships = { topics: { data: [ createdTopic.id ] }};
            dispatch(createCard({ attributes, relationships }));
          }
        }
      },
      fail: (xhr, status, error) => {
        failure('Failed to get drobox files! Try again');
        dispatch(dropboxError(error));
      }
    });
  };
