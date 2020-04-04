/* eslint-env mocha */
import { expect } from 'chai';
import reducer from './roles';
import * as actions from 'AppConstants';

const initialState = {
  isLoading: null,
  collection: [],
  error: null
};

describe('app user reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.deep.equal(initialState);
  });

  it('should return loading state', () => {
    expect(
      reducer(initialState, { type: actions.GET_ROLES_REQUEST })
    ).to.have.property('isLoading', true);
  });

  it('should return error state', () => {
    expect(
      reducer(initialState, {
        type: actions.GET_ROLES_FAILURE,
        payload: ['error']
      })
    )
      .to.deep.include({
        isLoading: false,
        error: ['error']
      });
  });

  it('should set roles collection', () => {
    expect(
      reducer(initialState, {
        type: actions.GET_ROLES_SUCCESS,
        payload: [{ role: 'member' }]
      })
    ).to.deep.include({
      isLoading: false,
      collection: [{ role: 'member' }]
    });
  });
});
