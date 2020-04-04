import { EventEmitter } from 'events';
import AppDispatcher from '../dispatchers/app_dispatcher';
import APIRequest from '../lib/ApiRequest';

let _domains = [];

const DomainFormPageStore = Object.assign({}, EventEmitter.prototype, {
  buildAdminRolesData: function(adminUserIDs) {
    if (adminUserIDs) {
      var adminRolesData = [];
      $(adminUserIDs).each(function(index, userID) {
        var itemData = userID.split('-');
        if (itemData[0] !== 'users') {
          // next item
          return true;
        }

        adminRolesData.push({name: 'admin', user_id: itemData[1]});
      });

      return { data: adminRolesData };
    }
    return null;
  },

  loadDomains: function() {
    var _this = this;

    var $loadXHR = APIRequest.get({
      resource: 'domains'
    });

    $loadXHR.done(function(response, status, xhr) {
      _domains = response.data;
      _this.emitEventWithData(window.DOMAINS_LOAD_EVENT, response);
    });
  },

  createDomain: function(name, tenantName, domainSSOSettings, adminUserIDs, domainPermission) {
    var _this = this;

    var admins = DomainFormPageStore.buildAdminRolesData(adminUserIDs);

    var $createXHR = APIRequest.post({
      resource: 'domains',
      data: {
        data: {
          attributes: {
            name: name,
            tenant_name: tenantName,
            sso_enabled: domainSSOSettings.domainSSOEnabled,
            idp_entity_id: domainSSOSettings.domainIDPEntityID,
            idp_sso_target_url: domainSSOSettings.domainIDPSSOTargetURL,
            idp_slo_target_url: domainSSOSettings.domainIDPSLOTargetURL,
            issuer: domainSSOSettings.domainIssuer
          },
          relationships: {
            roles: admins,
            domain_permission: {
              data: domainPermission
            }
          }
        }
      }
    });

    $createXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.DOMAIN_CREATE_EVENT, response);
      APIRequest.showSuccessMessage('Workspace created.');
    }).fail(function(xhr, status, error) {
      _this.emitEventWithData(window.DOMAIN_CREATE_EVENT, status);
      if (xhr.responseJSON && xhr.responseJSON.errors) {
        APIRequest.showErrorMessage(xhr.responseJSON.errors.detail.join('<br />'));
      } else {
        APIRequest.showErrorMessage('Could not create Workspace.');
      }
    });
  },

  updateDomain: function(domainID, name, tenantName, domainSSOSettings, adminUserIDs, domainPermission, color) {
    var _this = this;

    var admins = DomainFormPageStore.buildAdminRolesData(adminUserIDs);

    var $updateXHR = APIRequest.patch({
      resource: 'domains/' + domainID,
      data: {
        data: {
          attributes: {
            name: name,
            sso_enabled: domainSSOSettings.domainSSOEnabled,
            idp_entity_id: domainSSOSettings.domainIDPEntityID,
            idp_sso_target_url: domainSSOSettings.domainIDPSSOTargetURL,
            idp_slo_target_url: domainSSOSettings.domainIDPSLOTargetURL,
            issuer: domainSSOSettings.domainIssuer,
            color,
          },
          relationships: {
            roles: admins,
            domain_permission: {
              data: domainPermission
            }
          }
        }
      }
    });

    $updateXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.DOMAIN_UPDATE_EVENT, response);
      APIRequest.showSuccessMessage('Workspace updated.');
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage(xhr.responseJSON.errors.detail.join('<br />'));
    });
  },

  updateDomainDefaultCardView: function(domainID, defaultViewId) {
    var _this = this;

    var $updateXHR = APIRequest.patch({
      resource: 'domains/' + domainID,
      data: {
        data: {
          attributes: {
            default_view_id: defaultViewId
          }
        }
      }
    });

    $updateXHR.done(function(response, status, xhr) {
      _this.emitEventWithData(window.DOMAIN_UPDATE_EVENT, response);
      APIRequest.showSuccessMessage('Set default view.');
    }).fail(function(xhr, status, error) {
      APIRequest.showErrorMessage(xhr.responseJSON.errors.detail.join('<br />'));
    });
  },

  getDomains: function() {
    return _domains;
  },

  clearDomains: function() {
    _domains = [];
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

DomainFormPageStore.dispatchToken = AppDispatcher.register(function(payload) {
  let domainID, name, tenantName, domainSSOSettings, adminUserIDs, domainPermission, defaultViewId, color;

  switch(payload.actionType) {
    case 'LOAD_DOMAINS':
      DomainFormPageStore.loadDomains();
      break;

    case 'CREATE_DOMAIN':
      name              = payload.name;
      tenantName        = payload.tenantName;
      domainSSOSettings = payload.domainSSOSettings;
      adminUserIDs      = payload.adminUserIDs;
      domainPermission  = payload.domainPermission;
      DomainFormPageStore.createDomain(name, tenantName, domainSSOSettings, adminUserIDs, domainPermission);
      break;

    case 'UPDATE_DOMAIN':
      domainID          = payload.domainID;
      name              = payload.name;
      tenantName        = payload.tenantName;
      domainSSOSettings = payload.domainSSOSettings;
      adminUserIDs      = payload.adminUserIDs;
      domainPermission  = payload.domainPermission;
      color             = payload.color
      DomainFormPageStore.updateDomain(domainID, name, tenantName, domainSSOSettings, adminUserIDs, domainPermission, color);
      break;

    case 'UPDATE_DOMAIN_DEFAULT_CARD_VIEW':
      domainID          = payload.domainID;
      defaultViewId   = payload.defaultViewId;      
      DomainFormPageStore.updateDomainDefaultCardView(domainID, defaultViewId);
      break;

    default:
    // no op
  }
});

export default DomainFormPageStore;
