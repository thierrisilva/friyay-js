import OAuthClient from 'Src/lib/oauth/oauth_client';
import Cookies from 'js-cookie';
import { failure, success } from 'Utils/toast';
import { updateCard } from 'Src/newRedux/database/cards/thunks';
import { createAttachment } from 'Src/newRedux/database/attachments/thunks';
import { createTopic } from 'Src/newRedux/database/topics/thunks';
import { createCard } from 'Src/newRedux/database/cards/thunks';
import { setShowAddCardBottomOverlay } from 'Src/newRedux/interface/modals/actions';
import {
  googleListFiles,
  googleListFilesDone,
  googleError,
  googleDisconnectDone,
} from './actions';

export const refreshToken = accessToken =>
  async dispatch => {

    let authClient = OAuthClient.create({ provider: 'google' });

    let token = authClient.createToken(
      accessToken,
      refreshToken,
      'Bearer', {
        data: {
          grant_type: 'refresh_token'
        }
      });

    token.refresh().then((authorizedData) => {

      Cookies.set('googleRefreshToken', authorizedData.refreshToken, {
        domain: `.${window.APP_DOMAIN}`,
        expires: 365
      });

      Cookies.set('googleRefreshToken', authorizedData.accessToken, {
        domain: `.${window.APP_DOMAIN}`,
        expires: authorizedData.expires
      });

      // remain to find subscription
      dispatch({
        type: 'GOOGLE_REFRESH_TOKEN_DONE',
        authorizedData: authorizedData
      });
    }).catch((error) => {
      dispatch(googleError(error));
    });
  };

export const listFiles = (accessToken, folderID, nextPageToken) =>
  async dispatch => {
    dispatch(googleListFiles(folderID));
    let fileListingURL = 'https://www.googleapis.com/drive/v3/files';

    let queryData = { corpora: 'user', orderBy: 'folder,name' };
    if (folderID && folderID !== '') {
      queryData['q'] = `'${folderID}' in parents`;

      if (folderID === 'root') queryData['q'] += ' or sharedWithMe';
    }

    if (nextPageToken) queryData['pageToken'] = nextPageToken;

    OAuthClient.get({
      accessToken,
      url: fileListingURL,
      data: queryData,
      done: (response) => {
        dispatch(googleListFilesDone(response.files, response.nextPageToken));
      },
      fail: (xhr, status, error) => {
        failure('Failed to get drive files! Try again');
        dispatch(googleError(error));
      }
    });
  };

export const disconnect = (accessToken) =>
  async dispatch => {
    OAuthClient.get({
      accessToken,
      url: 'https://accounts.google.com/o/oauth2/revoke',
      data: { token: accessToken },
      done: (response) => {
        Cookies.remove('googleAccessToken', { domain: `.${window.APP_DOMAIN}` });
        dispatch(googleDisconnectDone(response));
        success('Google drive disconnected!');
      },
      fail: (xhr, status, error) => {
        failure('Failed to disconnect drive! Try again');
        dispatch(googleError(error));
      }
    });
  };

export const addGoogleFileToCard = ({ dropZoneProps, draggedItemProps }) =>
  async dispatch => {
    const {card, method} = dropZoneProps;
    const {fileItem} = draggedItemProps.item;
    const accessToken = Cookies.get('googleAccessToken');
    dispatch(setShowAddCardBottomOverlay(false));
    await dispatch(getGoogleFileURL(accessToken, card, fileItem, method));
  };

export const getGoogleFileURL = (accessToken, card, fileItem, method) =>
  async (dispatch) => {
    OAuthClient.post({
      accessToken,
      url: `https://www.googleapis.com/drive/v3/files/${fileItem.id}/permissions`,
      data: {
        role: 'reader',
        type: 'anyone'
      },
      done: () => {

      },
      fail: () => {
        failure('Failed to grant permission for google file');
      }
    });

    OAuthClient.get({
      accessToken,
      url: `https://www.googleapis.com/drive/v3/files/${fileItem.id}`,
      data: { fields: 'webContentLink,webViewLink' },
      done: (response) => {
        let fileResponse = {
          id:       fileItem.id,
          kind:     fileItem.kind,
          name:     fileItem.name,
          mimeType: fileItem.mimeType,
          url:      response.webViewLink,
          link:     response.webContentLink
        };

        const source = fileItem;
        const target = fileResponse;

        if (method) {
          dispatch(uploadFile(accessToken, source, target, method, card));
        } else { 
          window.open(fileResponse.url,'_blank');
        }
      },
      fail: () => {
        failure('Unable to attach google file');
      }
    });
  };

export const uploadFile = (accessToken, fileItem, fileResponse, method, card) =>
  async (dispatch) => {
    let link     = fileResponse.link; // upload
    let file_url = fileResponse.url; // link
    let mimeType = fileResponse.mimeType;

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
    uploadData['action'] = 'attachments';
    dispatch(createAttachment(uploadData));
  };

export const createTopicAndCardsForGoogleFolder = (itemProps) =>
  async dispatch => {
    const { draggedItemProps, dropZoneProps, providerData } = itemProps;
    const parentTopic = dropZoneProps.item || {};
    const accessToken = Cookies.get('googleAccessToken');
    const folderID = draggedItemProps.item.fileItem.id;

    let fileListingURL = 'https://www.googleapis.com/drive/v3/files';

    let queryData = { corpora: 'user', orderBy: 'folder,name' };

    if (folderID && folderID !== '') {
      queryData['q'] = `'${folderID}' in parents`;

      if (folderID === 'root') queryData['q'] += ' or sharedWithMe';
    }

    if (providerData.nextPageToken) queryData['pageToken'] = providerData.nextPageToken;

    const newTopic = {
      attributes: { title: draggedItemProps.item.fileItem.name, parent_id: parentTopic.id || null },
      relationships: parentTopic.relationships || {},
    };

    const { data: { data: createdTopic }} = await dispatch( await createTopic(newTopic));

    OAuthClient.get({
      accessToken,
      url: fileListingURL,
      data: queryData,
      done: (response) => {
        const files = response.files || [];
        for (const inx in files) {
          if (files[inx].mimeType.includes('folder')) {
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
        failure('Failed to get drive files! Try again');
        dispatch(googleError(error));
      }
    });
  };
