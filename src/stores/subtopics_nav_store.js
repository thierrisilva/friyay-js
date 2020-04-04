import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';

const SubTopicsNav = Object.assign({}, EventEmitter.prototype, {
	
	toggle(value, topic) {
		this.emitEventWithData(window.TOGGLE_SUBTOPICS_NAV, {value, topic});
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
SubTopicsNav.dispatchToken = AppDispatcher.register(function(payload) {
  switch(payload.actionType) {
    
    case 'TOGGLE_SUBTOPICS_NAV':
      SubTopicsNav.toggle(payload.value, payload.topic);
      break;

    default:
    // no op
  }
});

export default SubTopicsNav;
