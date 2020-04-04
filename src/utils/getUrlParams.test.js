/* eslint-env mocha */
import { expect } from 'chai';
import getUrlParams from './getUrlParams';

describe('[getUrlParams] utils/getUrlParams.js', () => {
  it('should return a string of params based on flat object', () => {
    const proof = {
      'a': 1,
      'b': 2
    };

    expect(getUrlParams(proof)).to.equal('a=1&b=2');
  });

  it('should return a string of params based on nested object', () => {
    const proof = {
      'a': 1,
      'b': 2,
      'c': {
        'd': 3
      }
    };

    expect(getUrlParams(proof)).to.equal('a=1&b=2&c[d]=3');
  });

  it('should return an empty string with no object', () => {
    expect(getUrlParams(true)).to.equal('');
  });
});
