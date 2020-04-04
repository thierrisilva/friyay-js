/* eslint-env mocha */
import { expect } from 'chai';
import reducer from './appUser';
import * as actions from 'AppConstants';

const initialState = {
  isLoading: null,
  id: null,
  email: null,
  username: null,
  name: null,
  firstName: null,
  lastName: null,
  avatar: null,
  user: null,
  error: {
    title: null,
    details: []
  },
  introTourFinished: true
};

describe('app user reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.deep.equal(initialState);
  });

  it('should return loading state', () => {
    expect(
      reducer(initialState, { type: actions.GET_APP_USER_REQUEST })
    ).to.have.property('isLoading', true);
  });

  it('should return error state', () => {
    expect(
      reducer(initialState, {
        type: actions.GET_APP_USER_FAILURE,
        payload: { title: 'error' }
      })
    )
      .to.deep.include({
        isLoading: false,
        error: { title: 'error', details: [] }
      });
  });

  it('should set user', () => {
    const user = {
      id: '1',
      attributes: {
        email: 'example@email.com',
        username: 'username_1',
        first_name: 'first_name_1',
        last_name: 'last_name_1'
      },
      relationships: {
        user_profile: {
          data: {
            avatar_url: 'avatar_1'
          }
        }
      }
    };

    expect(
      reducer(initialState, {
        type: actions.GET_APP_USER_SUCCESS,
        payload: user
      })
    ).to.deep.equal({
      isLoading: false,
      id: '1',
      email: 'example@email.com',
      username: 'username_1',
      name: 'first_name_1 last_name_1',
      firstName: 'first_name_1',
      lastName: 'last_name_1',
      avatar: 'avatar_1',
      user,
      error: {
        title: null,
        details: []
      },
      introTourFinished: true
    });

    expect(localStorage.getItem('user_id')).to.equal('1');
    expect(localStorage.getItem('user_email')).to.equal('example@email.com');
    expect(localStorage.getItem('user_username')).to.equal('username_1');
    expect(localStorage.getItem('user_name')).to.equal('first_name_1 last_name_1');
    expect(localStorage.getItem('user_first_name')).to.equal('first_name_1');
    expect(localStorage.getItem('user_last_name')).to.equal('last_name_1');
    expect(localStorage.getItem('user_avatar')).to.equal('avatar_1');
  });

  it('should sweep user', () => {
    const currentState = {
      isLoading: false,
      id: '1',
      email: 'example@email.com',
      username: 'username_1',
      name: 'first_name_1 last_name_1',
      firstName: 'first_name_1',
      lastName: 'last_name_1',
      avatar: 'avatar_1',
      user: {},
      error: {
        title: null,
        details: []
      },
      introTourFinished: true
    };

    expect(
      reducer(currentState, { type: actions.LOGOUT_USER })
    ).to.deep.equal(Object.assign({}, initialState, { isLoading: false }));

    expect(localStorage.getItem('user_id')).to.equal(null);
    expect(localStorage.getItem('user_email')).to.equal(null);
    expect(localStorage.getItem('user_username')).to.equal(null);
    expect(localStorage.getItem('user_name')).to.equal(null);
    expect(localStorage.getItem('user_first_name')).to.equal(null);
    expect(localStorage.getItem('user_last_name')).to.equal(null);
    expect(localStorage.getItem('user_avatar')).to.equal(null);
  });
});
