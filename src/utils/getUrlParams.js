import { toPairs, is, isNil, not, compose } from 'ramda';

const isObject = is(Object);
const notNil = compose(not, isNil);

const getUrlParams = options => {
  let url = '';

  if (!isObject(options)) {
    return url;
  }

  for (let [key, value] of toPairs(options)) {
    if (isObject(value)) {
      for (let [childKey, childValue] of toPairs(value)) {
        if (notNil(childValue)) {
          url += `&${key}[${childKey}]=${encodeURI(childValue)}`;
        }
      }
    } else {
      if (notNil(value)) {
        url += `&${key}=${encodeURI(value)}`;
      }
    }
  }

  return url.substr(1);
};

export default getUrlParams;