import { EventEmitter } from 'events';
import AppDispatcher from '../../dispatchers/app_dispatcher';

const RightActionLabelsFilterStore = Object.assign({}, EventEmitter.prototype, {

  closeFilterTipByLabelView: function() {
    this.emitEvent(window.CLOSE_FILTER_TIP_BY_LABEL);
  },

  emitEvent: function(eventType) {
    this.emit(eventType);
  },

  addEventListener: function(eventType, callback) {
    this.on(eventType, callback);
  },

  removeEventListener: function(eventType, callback) {
    this.removeListener(eventType, callback);
  }

});

RightActionLabelsFilterStore.dispatchToken = AppDispatcher.register(function(payload) {
  var view;

  switch(payload.actionType) {
    case 'CLOSE_FILTER_TIP_BY_LABEL':
      RightActionLabelsFilterStore.closeFilterTipByLabelView();
      break;
    default:
  }
});

export default RightActionLabelsFilterStore;
