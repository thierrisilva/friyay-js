import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';
let _dashboardData = [];

const DashboardStore = Object.assign({}, EventEmitter.prototype, {
  loadStats: function() {
    var _this = this;
    var getAllXHR = APIRequest.get({
      resource: 'dashboard',
      data: {
      }
    });

    getAllXHR.done(function(response, status, xhr) {
      _dashboardData = response.data;
      _this.emitEventWithData(window.DASHBOARD_LOAD_EVENT, response);
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage('Unable to locate dashboard');
      window.location = '/';
    });
  },

  getAll: function() {
    return _dashboardData;
  },

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
DashboardStore.dispatchToken = AppDispatcher.register(function(payload) {
  switch(payload.actionType) {
    case 'LOAD_DASHBOARD':
      DashboardStore.loadStats();
      break;

    default:
      // no op
  }
});

export default DashboardStore;
