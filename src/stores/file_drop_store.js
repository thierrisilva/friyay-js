import { ReduceStore } from 'flux/utils';

import mimeTypeChecker from 'mime';
import OAuthClient from '../lib/oauth/oauth_client';

import AppDispatcher from '../dispatchers/app_dispatcher';
import SubDispatcher from '../dispatchers/sub_dispatcher';

import MainFormStore from '../stores/main_form_store';

import APIRequest from '../lib/ApiRequest';

class FileDropStore extends ReduceStore {
  constructor() {
    super(SubDispatcher);
  }

  getInitialState() {
    return {
      method: null,
      sendingDropFiles: {},
      uploadingFiles:   {},
      updatedItems:     {},
    };
  }

  dropFileToTarget(state, action) {
    let newState = Object.assign({}, state);

    let { target, method } = action;

    if (!target) {
      return state;
    }

    let itemID   = target.id;
    let itemType = target.type;

    if (!itemID || !itemType) {
      return state;
    }

    if (target) {
      newState.method = method;
      newState.sendingDropFiles[`${itemType}-${itemID}`] = true;
      this.getFileURL(state, action);
    }

    return newState;
  }

  getFileURL(state, action) {
    let { source, target, method, accessToken } = action;
    let { provider, fileItem } = source;

    // if (this.isFile(provider, fileItem) === false) return state;

    let newState = Object.assign({}, state);

    switch (provider) {
      case 'dropbox':
        this.getDropboxFileURL(state, action);
        break;
      case 'google':
        this.getGoogleFileURL(state, action);
        break;
      case 'box':
        this.getBoxFileURL(state, action);
        break;
    }

    return newState;
  }

  uploadFile(state, action) {
    let _this = this;

    let { source, target, method, fileResponse } = action;
    let { provider } = source;
  
    if (!fileResponse) {
      return state;
    }

    let newState = Object.assign({}, state);

    let link     = fileResponse.link; // upload
    let file_url = fileResponse.url; // link

    let mimeType = null;
    let itemID   = target.id;
    let itemType = target.type;

    switch (provider) {
      case 'dropbox':
        mimeType = mimeTypeChecker.lookup(fileResponse.path_lower);
        break;

      case 'google':
        mimeType = fileResponse.mimeType;
        break;

      case 'box':
        mimeType = mimeTypeChecker.lookup(fileResponse.name);
        break;
    }

    // is link method...
    if (method === 'link') {

      // if linking file to new item
      if (itemID === 'new') {
        let itemKey = `${itemType}-${itemID}`;

        newState.sendingDropFiles[itemKey] = false;
        newState.uploadingFiles[itemKey]   = false;
        newState.updatedItems[itemKey]     = { name: fileResponse.name, url: file_url };

        return newState;
      }

      // switch (provider) {
      //   case 'dropbox':
      //     if (fileResponse['.tag'] !== 'file') {
      //       APIRequest.showErrorMessage('Link is not a valid file');
      //
      //       return newState;
      //     }
      //     break;
      // }

      let { attributes } = target;
      let itemBody = attributes.body;

      if (itemBody.includes(file_url) === false) {
        itemBody += `\n${file_url} `;
      }

      let $updateXHR = APIRequest.patch({
        resource: `${itemType}/${itemID}`,
        data: {
          data: {
            type: itemType,
            attributes: {
              body: itemBody
            }
          }
        }
      });

      $updateXHR.done(function(response, status, xhr) {
        MainFormStore.emitEventWithData(window.ITEM_UPDATE_EVENT, response);
        APIRequest.showSuccessMessage(`Link added to ${target.attributes.title}`);

        SubDispatcher.dispatch({
          type: 'UPLOAD_FILE_DONE',
          source,
          target,
          method,
          updatedItem: response
        });
      }).fail(function(xhr, status, error) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.title);

        SubDispatcher.dispatch({
          source,
          target,
          method,
          type: 'UPLOAD_FILE_FAIL',
          error
        });
      });

      return newState;
    }

    if (!link) {
      let errorMessage = `Could not get download link for ${fileResponse.name}`;
      APIRequest.showErrorMessage(errorMessage);

      return this.uploadFileFail(state, action);
    }

    let uploadData = {
      data: {
        access_token: action.accessToken,
        attributes: {
          remote_file_url: link,
          mime_type: mimeType
        }
      }
    };

    if (itemType === 'tips' && itemID !== 'new') {
      uploadData['tip_id'] = itemID;
      uploadData['response_with_tip'] = true;
    }

    newState.uploadingFiles[`${itemType}-${itemID}`] = true;

    let $uploadingXHR = APIRequest.post({
      resource: 'attachments',
      data: uploadData
    });

    $uploadingXHR.done((response, status, xhr) => {
      let successMessage;
      if (target && target.attributes) {
        successMessage = `File attached to ${target.attributes.title}`;
      } else {
        successMessage = 'File attached';
      }
      APIRequest.showSuccessMessage(successMessage);

      SubDispatcher.dispatch({
        type: 'UPLOAD_FILE_DONE',
        source,
        target,
        method,
        updatedItem: response
      });
    }).fail((xhr, status, error) => {
      SubDispatcher.dispatch({
        source,
        target,
        method,
        type: 'UPLOAD_FILE_FAIL',
        error
      });
    });

    return newState;
  }

  uploadFileDone(state, action) {
    let newState = Object.assign({}, state);

    let { target } = action;

    let itemID   = target.id;
    let itemType = target.type;

    let itemKey = `${itemType}-${itemID}`;

    newState.sendingDropFiles[itemKey] = false;
    newState.uploadingFiles[itemKey]   = false;
    newState.updatedItems[itemKey]     = action.updatedItem;

    return newState;
  }

  uploadFileFail(state, action) {
    let newState = Object.assign({}, state);

    let { target } = action;

    let itemID   = target.id;
    let itemType = target.type;

    let itemKey = `${itemType}-${itemID}`;

    newState.sendingDropFiles[itemKey] = false;
    newState.uploadingFiles[itemKey]   = false;
    newState.updatedItems[itemKey]     = null;

    return newState;
  }

  clearItemUploadedFile(state, action) {
    let newState = Object.assign({}, state);

    let itemKey = `${action.itemType}-${action.itemID}`;

    newState.sendingDropFiles[itemKey] = false;
    newState.uploadingFiles[itemKey]   = false;
    newState.updatedItems[itemKey]     = null;

    return newState;
  }

  isFile(provider, fileItem) {
    let result = false;

    switch (provider) {
      case 'dropbox':
        if (fileItem['.tag'] === 'file') result = true;
        break;
      case 'google':
        if (fileItem['mimeType'] !== 'application/vnd.google-apps.folder') result = true;
        break;
      case 'box':
        if (fileItem['type'] !== 'folder') result = true;
        break;
    }

    return result;
  }

  getDropboxFileURL(state, action) {
    let { source, target, method, accessToken } = action;
    let { fileItem } = source;

    if (method === 'link') {
      OAuthClient.post({
        accessToken,
        url: 'https://api.dropboxapi.com/2/sharing/list_shared_links',
        data: { path: fileItem.id },
        done: (response) => {
          let links = response.links;
          if (links.length > 0) {
            let link = links[0];

            SubDispatcher.dispatch({
              type: 'UPLOAD_FILE',
              accessToken,
              source,
              target,
              method,
              fileResponse: link
            });
          } else {
            OAuthClient.post({
              accessToken,
              url: 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
              data: { path: fileItem.id },
              done: (response) => {
                SubDispatcher.dispatch({
                  type: 'UPLOAD_FILE',
                  accessToken,
                  source,
                  target,
                  method,
                  fileResponse: response
                });
              },
              fail: (xhr, status, error) => {

              }
            });
          }
        },
        fail: (xhr, status, error) => {

        }
      });

      return state;
    }

    if (method === 'upload') {
      OAuthClient.post({
        accessToken,
        url: 'https://api.dropboxapi.com/2/files/get_temporary_link',
        data: { path: fileItem.id },
        done: (response) => {
          let fileResponse = response.metadata;
          fileResponse['link'] = response.link;

          SubDispatcher.dispatch({
            type: 'UPLOAD_FILE',
            accessToken,
            source,
            target,
            method,
            fileResponse
          });
        },
        fail: (xhr, status, error) => {

        }
      });
    }
  }

  getGoogleFileURL(state, action) {
    let { source, target, method, accessToken } = action;
    let { fileItem } = source;

    OAuthClient.post({
      accessToken,
      url: `https://www.googleapis.com/drive/v3/files/${fileItem.id}/permissions`,
      data: {
        role: 'reader',
        type: 'anyone'
      },
      done: (response) => {

      },
      fail: (xhr, status, error) => {
        APIRequest.showErrorMessage(`Failed to grant read permission to the file ${fileItem.name}`);
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

        SubDispatcher.dispatch({ type: 'UPLOAD_FILE', accessToken, source, target, method, fileResponse });
      },
      fail: (xhr, status, error) => {

      }
    });
  }

  getBoxFileURL(state, action) {
    let { source, target, method, accessToken } = action;
    let { fileItem } = source;

    OAuthClient.get({
      accessToken,
      url: `https://api.box.com/2.0/files/${fileItem.id}`,
      done: (response) => {

        SubDispatcher.dispatch({
          type: 'UPLOAD_FILE',
          accessToken,
          source,
          target,
          method,
          fileResponse: {
            id:   fileItem.id,
            name: fileItem.name,
            link: response.shared_link ? response.shared_link.download_url : null // requires paid account
          }
        });
      },
      fail: (xhr, status, error) => {

      }
    });
  }

  reduce(state, action) {
    switch (action.type) {
      case 'DROP_FILE_TO_TARGET':
        return this.dropFileToTarget(state, action);

      case 'UPLOAD_FILE':
        return this.uploadFile(state, action);

      case 'UPLOAD_FILE_DONE':
        return this.uploadFileDone(state, action);

      case 'UPLOAD_FILE_FAIL':
        return this.uploadFileFail(state, action);

      case 'CLEAR_ITEM_UPLOADED_FILE':
        return this.clearItemUploadedFile(state, action);

      default:
        return state;
    }
  }
}

export default new FileDropStore();
