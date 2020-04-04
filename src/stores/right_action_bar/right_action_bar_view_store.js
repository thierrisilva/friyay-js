import { EventEmitter } from 'events';
import AppDispatcher from '../../dispatchers/app_dispatcher';

let _view = localStorage.getItem('view') || 'grid';

const RightActionBarViewStore = Object.assign({}, EventEmitter.prototype, {
  onTipViewChange: function(view) {
    _view = view === 'menu' ? _view : view;
    this.emitEventWithData(window.TIP_VIEW_CHANGE, view);
    return _view;
  },

  getView: () => _view,

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

RightActionBarViewStore.dispatchToken = AppDispatcher.register(function(payload) {
  var view;

  switch(payload.actionType) {
    case 'TIP_VIEW_CHANGE':
      view = payload.view;
      RightActionBarViewStore.onTipViewChange(view);
      break;
    default:
  }
});

export default RightActionBarViewStore;
