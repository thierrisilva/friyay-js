import { EventEmitter } from 'events';

const AutoSaveStore = Object.assign({}, EventEmitter.prototype, {
  saveContent: function(content) {
    // console.log('Store save content', content);
    var autoSaveContent = localStorage.setItem(window.AUTOSAVE_KEY, JSON.stringify(content));
    this.emitEventWithData(window.AUTOSAVE_SAVE_EVENT, autoSaveContent);
    return autoSaveContent;
  },

  loadContent: function() {
    var autoSaveContent = JSON.parse(localStorage.getItem(window.AUTOSAVE_KEY));
    // console.log('Store load content', autoSaveContent);
    this.emitEventWithData(window.AUTOSAVE_LOAD_EVENT, autoSaveContent);
    return autoSaveContent;
  },

  clearContent: function() {
    // console.log('Store clear content');
    localStorage.removeItem(window.AUTOSAVE_KEY);
    this.emitEvent(window.AUTOSAVE_CLEAR_EVENT);
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

export default AutoSaveStore;