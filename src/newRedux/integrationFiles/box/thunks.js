import { failure } from 'Utils/toast';
import Cookies from 'js-cookie';
import { updateCard } from 'Src/newRedux/database/cards/thunks';
import { createAttachment } from 'Src/newRedux/database/attachments/thunks';
import mimeTypeChecker from 'mime';
import OAuthClient from 'Src/lib/oauth/oauth_client';
import { setShowAddCardBottomOverlay } from 'Src/newRedux/interface/modals/actions';
import {
  boxListFiles,
  boxListFilesDone,
  boxError,
  boxDisconnectDone,
} from './actions';

export const listFiles = (accessToken, folderID, pageToken) =>
  async dispatch => {
    dispatch(boxListFiles(folderID));
    const fileListingURL = `${window.BOX_APP_URL}/folders/${folderID}/items`;
    const queryData = {};

    if (pageToken) queryData['offset'] = pageToken;

    OAuthClient.post({
      accessToken,
      url: fileListingURL,
      data: queryData,
      done: (response) => {
        const nextPageToken = response.offset > 0 ? response.offset : null;
        dispatch(boxListFilesDone(response.entries, nextPageToken));
      },
      fail: (xhr, status, error) => {
        failure('Failed to get box files! Try again');
        dispatch(boxError(error));
      }
    });
  };

export const disconnect = (accessToken) =>
  async dispatch =>
    OAuthClient.post({
      accessToken,
      url: `${window.BOX_APP_URL}/auth/token/revoke`,
      data: 'null',
      done: (response) => {
        Cookies.remove('dropboxAccessToken', { domain: `.${window.APP_DOMAIN}` });
        dispatch(boxDisconnectDone(response));
      },
      fail: () => {
        failure('Failed to disconnect box! Try again');
      }
    });

export const addBoxFileToCard = ({ dropZoneProps, draggedItemProps }) =>
  async dispatch => {
    const {card, method} = dropZoneProps;
    const {fileItem} = draggedItemProps.item;
    const accessToken = Cookies.get('boxAccessToken');
    dispatch(setShowAddCardBottomOverlay(false));
    await dispatch(getBoxFileURL(accessToken, card, fileItem, method));
  };

export const getBoxFileURL = (accessToken, card, fileItem, method) =>
  async (dispatch) => {
    OAuthClient.get({
      accessToken,
      url: `${window.BOX_APP_URL}/files/${fileItem.id}`,
      done: (response) => {
        const fileResponse = {
          id:   fileItem.id,
          name: fileItem.name,
          link: response.shared_link ? response.shared_link.download_url : null
        };
        const source = fileItem;
        const target = fileResponse;

        dispatch(uploadFile(accessToken, source, target, method, card));
      },
      fail: () => {
        failure('Unable to attach box file');
      }
    });
  };

export const uploadFile = (accessToken, fileItem, fileResponse, method, card) =>
  async (dispatch) => {
    let link     = fileResponse.link; // upload
    let file_url = fileResponse.url; // link
    let mimeType = mimeTypeChecker.lookup(fileResponse.name);

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
