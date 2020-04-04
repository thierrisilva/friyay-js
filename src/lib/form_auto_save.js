import AutoSaveStore from '../stores/auto_save_store';

function FormAutoSave(options) {
  this._options = options || {};

  this.waitSeconds  = this._options['waitSeconds'] || 3;
  this.formID       = this._options['formID'];
  this.formFieldIDs = this._options['formFieldIDs'];
  this.timeoutIDs   = [];

  this.autoSaveContent = {};

  // console.log('Auto save init:', options);
}

FormAutoSave.prototype.getContent = function() {
  // console.log('Auto save get content:', this.formID);

  this.autoSaveContent[this.formID] = {};

  var loadedContent = AutoSaveStore.loadContent();
  $.each(loadedContent, function(formID, savedFormFields) {
    this.autoSaveContent[formID] = {};

    $.each(savedFormFields, function(formFieldID, value) {
      if (value) {
        // console.log('Read back value:', value);
        this.autoSaveContent[formID][formFieldID] = value;
      }
    }.bind(this));
  }.bind(this));

  return this.autoSaveContent;
};

FormAutoSave.prototype.saveContent = function() {
  // console.log('Start saving:', this.formID, 'in every', this.waitSeconds, ' seconds - at:', Date.now());
  this.stop();

  this.autoSaveContent[this.formID] = {};

  $(this.formFieldIDs).each(function(index, formFieldID) {
    var formValue = $('#' + this.formID + ' #' + formFieldID).val();
    // console.log('Going to save value:', formFieldID, 'value:', formValue);

    if (formValue) {
      this.autoSaveContent[this.formID][formFieldID] = formValue;
    }
  }.bind(this));

  AutoSaveStore.saveContent(this.autoSaveContent);

  var timeoutID = setTimeout(function() {
    this.saveContent();
  }.bind(this), this.waitSeconds * 1000);

  this.timeoutIDs.push(timeoutID);
};

FormAutoSave.prototype.stop = function() {
  // console.log('Stop auto save. Clearing timeout IDs:', this.timeoutIDs);

  $.each(this.timeoutIDs, function(index, timeoutID) {
    clearTimeout(timeoutID);
  });

  this.timeoutIDs = [];
};

FormAutoSave.prototype.stopAndClear = function() {
  // console.log('Stop auto save and clear content');

  this.stop();
  AutoSaveStore.clearContent();
};

export default FormAutoSave;
