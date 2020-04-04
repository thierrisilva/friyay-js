import Cookies from 'js-cookie';
import axios from 'axios';

export const getToken = () => {
  let token = Cookies.get('authToken');

  if (!token && window.currentDomainName === 'support') {
    token = localStorage.getItem('guestAuthToken');
  }

  if (!token && localStorage.getItem('token')) {
    token = localStorage.getItem('token');
    localStorage.removeItem('token');
  }

  return token || null;
};

const getHeaders = () => {
  const token = getToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export let ApiRequest = axios.create({
  baseURL: window.API_URL,
  headers: getHeaders()
});

export let ApiRequestWithoutToken = axios.create({
  baseURL: window.API_URL
});

export const refreshInstance = () =>
  (ApiRequest = axios.create({
    baseURL: window.API_URL,
    headers: getHeaders()
  }));

const APIRequest = {
  headers(domain) {
    let authToken = this.authToken();
    const header = {};

    if (authToken) {
      header['Authorization'] = `Bearer ${authToken}`;
    }

    if (domain) {
      header['X-Tenant-Name'] = domain.attributes.tenant_name;
    }

    return header;
  },

  ajaxRequest(resource, method, data, beforeSend, domain) {
    let _this = this;
    return $.ajax({
      url: window.API_URL + '/' + resource,
      method: method,
      dataType: 'json',
      contentType: 'application/json',
      crossDomain: true,
      headers: _this.headers(domain),
      beforeSend: beforeSend,
      data: method !== 'GET' ? JSON.stringify(data) : data
    });
  },

  get(options) {
    return this.ajaxRequest(
      options['resource'],
      'GET',
      options.data,
      options.beforeSend,
      options.domain
    );
  },

  post(options) {
    return this.ajaxRequest(
      options['resource'],
      'POST',
      options.data,
      options.beforeSend,
      options.domain
    );
  },

  put(options) {
    return this.ajaxRequest(
      options['resource'],
      'PUT',
      options.data,
      options.beforeSend,
      options.domain
    );
  },

  patch(options) {
    return this.ajaxRequest(
      options['resource'],
      'PATCH',
      options.data,
      options.beforeSend,
      options.domain
    );
  },

  delete(options) {
    return this.ajaxRequest(
      options['resource'],
      'DELETE',
      options.data,
      options.beforeSend,
      options.domain
    );
  },

  abort(xhr) {
    if (xhr) {
      xhr.abort();
    }
  },

  showSuccessMessage(message, hideAfter) {
    Messenger().post({
      message: message,
      type: 'success',
      showCloseButton: true,
      hideAfter: hideAfter || 2
    });
  },

  showErrorMessage(message, hideAfter) {
    Messenger().post({
      message: message,
      type: 'error',
      showCloseButton: true,
      hideAfter: hideAfter || 3
    });
  },

  showInfoMessage(message, hideAfter) {
    Messenger().post({
      message: message,
      type: 'info',
      showCloseButton: true,
      hideAfter: hideAfter || 3
    });
  },

  authToken() {
    let _authToken = Cookies.get('authToken');

    if (!_authToken && window.currentDomainName === 'support') {
      _authToken = localStorage.guestAuthToken;
    }

    return _authToken;
  }
};

export default APIRequest;
