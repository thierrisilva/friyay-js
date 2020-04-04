import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import LeftMenuStore from './left_menu_store';
import UsersPageStore from './users_page_store';

let users = [];
let roles = [];

const UsersByDomainStore = Object.assign({}, EventEmitter.prototype, {
  getUsers: () => users,

  getRoles: () => roles,

  emitEvent: function(eventType) {
    this.emit(eventType);
  },

  emitEventWithData: function(eventType, eventData) {
    this.emit(eventType, eventData);
  },

  addEventListener: function(eventType, callback) {
    this.on(eventType, callback);
  },

  removeEventListener: function(eventType, callback) {
    this.removeListener(eventType, callback);
  }
});

// Register callback to handle all updates
UsersByDomainStore.dispatchToken = AppDispatcher.register(function(payload) {
  switch (payload.actionType) {
    case 'ALL_USERS':
      users = payload.users;
      UsersByDomainStore.emitEventWithData(window.USERS_BY_DOMAIN_LOAD, users);
      break;

    case 'ALL_ROLES':
      roles = payload.roles;
      UsersByDomainStore.emitEvent(window.ROLES_BY_DOMAIN_LOAD);
      break;

    case 'UPDATE_ROLE':
      users = users.map(
        user =>
          user.id === payload.userId
            ? Object.assign({}, user, { current_role: payload.role })
            : user
      );
      UsersByDomainStore.emitEvent(window.USERS_BY_DOMAIN_UPDATE);
      break;

    case 'REMOVE_MEMBER':
      users = users.filter(({ id }) => id !== payload.userId);
      LeftMenuStore.removeUser(payload.userId);
      UsersPageStore.removeUser(payload.userId);
      UsersByDomainStore.emitEvent(window.USERS_BY_DOMAIN_REMOVE);
      break;

    case 'REMOVE_MEMBER_FAIL':
      UsersByDomainStore.emitEvent(window.USERS_BY_DOMAIN_REMOVE_FAIL);
      break;

    default:
      break;
  }
});

export default UsersByDomainStore;
