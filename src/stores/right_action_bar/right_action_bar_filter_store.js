import { EventEmitter } from 'events';
import AppDispatcher from '../../dispatchers/app_dispatcher';
import tiphive from '../../lib/tiphive';

export const defaultFilter = isTopic => 
  isTopic || tiphive.isSupportDomain()
    ? 'all'
    : 'following';

const RightActionBarFilterStore = Object.assign({}, EventEmitter.prototype, {
  onTipFilterChange: function(view) {
    this.emitEventWithData(window.TIP_FILTER_CHANGE, view);
    return view;
  },

  onRightbarFilterChange: function(view) {
    this.emitEventWithData(window.RIGHTBAR_FILTER_CHANGE, view);
    return view;
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

RightActionBarFilterStore.dispatchToken = AppDispatcher.register(function(payload) {
  var view;

  switch(payload.actionType) {
    case 'RIGHTBAR_FILTER_CHANGE':
      view = payload.view;
      RightActionBarFilterStore.onRightbarFilterChange(view);
      break;
    case 'TIP_FILTER_CHANGE':
      view = payload.view;
      RightActionBarFilterStore.onTipFilterChange(view);
      break;
    default:
  }
});

export default RightActionBarFilterStore;
