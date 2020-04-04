import inflection from 'inflection';
import { EventEmitter } from 'events';
import { uniq } from 'underscore'; // dirty fix
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _labels = [];

const LabelStore = Object.assign({}, EventEmitter.prototype, {
  loadAll: function() {
    LabelStore.clearLabels();

    APIRequest
      .get({ resource: 'labels' })
      .done((response, status, xhr) => {
        _labels = uniq([..._labels, ...response.data], false, label => label.id);
        this.emitEventWithData(window.LABELS_LOAD_EVENT, response);
      });
  },

  createLabel: function(labelName, labelKind, labelColorIndex) {
    var _this = this;

    var $createXHR = APIRequest.post({
      resource: 'labels',
      data: {
        data: {
          attributes: {
            name: labelName,
            kind: labelKind,
            color: labelColorIndex
          }
        }
      }
    });

    $createXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.LABEL_CREATE_EVENT, response);
      APIRequest.showSuccessMessage('Label created.');
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage(xhr.responseJSON.errors.detail.join('<br />'));
    });
  },

  updateLabel: function(labelID, labelName, labelKind, labelColorIndex, itemID, itemType) {
    var _this = this;

    var $updateXHR = APIRequest.patch({
      resource: 'labels/' + labelID,
      data: {
        data: {
          attributes: {
            name: labelName,
            kind: labelKind,
            color: labelColorIndex
          }
        },
        item_id: itemID,
        item_type: inflection.capitalize(inflection.singularize(itemType || ''))
      }
    });

    $updateXHR.done(function(response, status, xhr) {
      // label assignment parent data is included
      if (response && response.included) {
        _this.emitEventWithData(window.LABEL_UPDATE_EVENT, response.included[0]);
      } else {
        _this.emitEvent(window.LABEL_UPDATE_EVENT);
      }
      // APIRequest.showSuccessMessage('Label updated.');
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage(xhr.responseJSON.errors.detail.join('<br />'));
    });
  },

  deleteLabel: function(labelID, itemID, itemType) {
    var _this = this;

    var $deleteXHR = APIRequest.delete({
      resource: 'labels/' + labelID,
      data: {
        item_id: itemID,
        item_type: inflection.capitalize(inflection.singularize(itemType || ''))
      }
    });

    $deleteXHR.done(function(response, status, xhr) {
      // label assignment parent data is included
      if (response && response.included) {
        _this.emitEventWithData(window.LABEL_DESTROY_EVENT, response.included[0]);
      } else {
        _this.emitEvent(window.LABEL_DESTROY_EVENT);
      }
      // APIRequest.showSuccessMessage('Label deleted.');
    }).fail(function(xhr, status, error) {
      $deleteXHR.showErrorMessage(xhr.responseJSON.errors.detail.join('<br />'));
    });
  },

  assignLabel: function(labelID, itemID, itemType) {
    var _this = this;

    var $assignXHR = APIRequest.post({
      resource: 'label_assignments',
      data: {
        data: {
          type: 'label_assignments',
          attributes: {
            label_id: labelID,
            item_id: itemID,
            item_type: inflection.capitalize(inflection.singularize(itemType))
          }
        }
      }
    });

    $assignXHR.done(function(response, status, xhr) {
      // label assignment parent data is included
      if (response && response.included) {
        _this.emitEventWithData(window.LABEL_ASSIGN_EVENT, response.included[0]);
      }
      // APIRequest.showSuccessMessage('Label assigned.');
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage(xhr.responseJSON.errors.detail.join('<br />'));
    });
  },

  removeLabel: function(labelID, itemID, itemType) {
    var _this = this;

    var $removeXHR = APIRequest.delete({
      resource: 'label_assignments/do-not-need',
      data: {
        data: {
          type: 'label_assignments',
          attributes: {
            label_id: labelID,
            item_id: itemID,
            item_type: inflection.capitalize(inflection.singularize(itemType))
          }
        }
      }
    });

    $removeXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.LABEL_REMOVE_EVENT, response.data);
      // APIRequest.showSuccessMessage('Label removed.');
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage(xhr.responseJSON.errors.detail.join('<br />'));
    });
  },

  filterTipByLabel: function(label, isLabelSelected) {
    this.emitEventWithData(window.FILTER_TIP_BY_LABEL, { label, isLabelSelected });
  },

  clearLabels: function() {
    _labels = [];
  },

  getLabels: function() {
    return _labels;
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
LabelStore.dispatchToken = AppDispatcher.register(function(payload) {
  var itemID, itemType, labelAssigned, labelAssignmentID, labelID, labelName, labelKind, labelColorIndex;

  switch(payload.actionType) {
    case 'LOAD_LABELS':
      LabelStore.loadAll();
      break;

    case 'CREATE_LABEL':
      labelName = payload.labelName;
      labelKind = payload.labelKind;
      labelColorIndex = payload.labelColorIndex;

      LabelStore.createLabel(labelName, labelKind, labelColorIndex);
      break;

    case 'UPDATE_LABEL':
      labelID   = payload.labelID;
      labelName = payload.labelName;
      labelKind = payload.labelKind;
      itemID    = payload.itemID;
      itemType  = payload.itemType;
      labelColorIndex = payload.labelColorIndex;

      LabelStore.updateLabel(labelID, labelName, labelKind, labelColorIndex, itemID, itemType);
      break;

    case 'DELETE_LABEL':
      labelID  = payload.labelID;
      itemID   = payload.itemID;
      itemType = payload.itemType;

      LabelStore.deleteLabel(labelID, itemID, itemType);
      break;

    case 'ASSIGN_LABEL':
      labelID  = payload.labelID;
      itemID   = payload.itemID;
      itemType = payload.itemType;

      LabelStore.assignLabel(labelID, itemID, itemType);
      break;

    case 'REMOVE_LABEL':
      labelID  = payload.labelID;
      itemID   = payload.itemID;
      itemType = payload.itemType;

      LabelStore.removeLabel(labelID, itemID, itemType);
      break;
    case 'FILTER_TIP_BY_LABEL':
      const { label, isLabelSelected } = payload;
      LabelStore.filterTipByLabel(label, isLabelSelected);
      break;
    default:
    // no op
  }
});

export default LabelStore;