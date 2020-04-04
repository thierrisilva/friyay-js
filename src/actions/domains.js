import { ApiRequest } from 'Lib/ApiRequest';
import { success, failure } from 'Utils/toast';

export const getDomainInfo = domainName => async () => {
  let currentDomain = null;

  try {
    const { data: { data } } = await ApiRequest.request({
      url: `domains/${domainName}/show`
    }).catch(({ response }) => {
      const { data: { errors: { detail } } } = response;
      if (!detail) {
        throw new Error('UNKNOWN_ERROR');
      } else {
        throw new Error(detail.join('::'));
      }
    });

    currentDomain = data;
  } catch ({ message }) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error(message);
    }
  }

  return currentDomain;
};
