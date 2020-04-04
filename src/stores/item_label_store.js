import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _labels = [];

const ItemLabelStore = Object.assign({}, EventEmitter.prototype, {

  builLabelsData: function(labelIDs) {
    if (labelIDs) {
      var labelsData = [];
      $(labelIDs).each(function(index, labelID) {
        labelsData.push({id: labelID, type: 'labels'});
      });

      if(!labelsData.length) {
        labelsData.push({id: '', type: 'labels'});
      }

      return { data: labelsData };
    }
    return null;
  },

  removeLabelFromTip: function(tip, labelIDs) {
    const { attributes, relationships } = tip;
    const { title, body } = attributes;
    var labelsBuildData = ItemLabelStore.builLabelsData(labelIDs);
    var $updateXHR = APIRequest.patch({
      resource: `tips/${tip.id}`,
      data: {
        data: {
          type: 'tips',
          attributes: {
            title: title,
            body: body,
            expiration_date: null
          },
          relationships: {
            labels: labelsBuildData
          }
        }
      }
    });

    $updateXHR.done((response, status, xhr) => {
      this.emitEventWithData(window.LABEL_REMOVE_FROM_TIP, response);
      APIRequest.showSuccessMessage('Label removed from Card');
    }).fail((xhr, status, error) => APIRequest.showErrorMessage(xhr.responseJSON.errors.title));
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
ItemLabelStore.dispatchToken = AppDispatcher.register(function(payload) {
  let item, labels;

  switch(payload.actionType) {

    case 'LABEL_REMOVE_FROM_TIP':
      item = payload.item;
      labels = payload.labels;
      ItemLabelStore.removeLabelFromTip(item, labels);
      break;

    default:
    // no op
  }
});

export default ItemLabelStore;
