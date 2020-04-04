import AppDispatcher from '../dispatchers/app_dispatcher';

var DomainFormPageActions = {
  loadDomains: function() {
    AppDispatcher.dispatch({
      actionType: 'LOAD_DOMAINS'
    });
  },

  createDomain: function(name, tenantName, domainSSOSettings, adminUserIDs, domainPermission) {
    AppDispatcher.dispatch({
      actionType: 'CREATE_DOMAIN',
      name: name,
      tenantName: tenantName,
      domainSSOSettings: domainSSOSettings,
      adminUserIDs: adminUserIDs,
      domainPermission: domainPermission
    });
  },

  updateDomain: function(domainID, name, tenantName, domainSSOSettings, adminUserIDs, domainPermission, domainColor) {
    AppDispatcher.dispatch({
      actionType: 'UPDATE_DOMAIN',
      domainID: domainID,
      name: name,
      tenantName: tenantName,
      domainSSOSettings: domainSSOSettings,
      adminUserIDs: adminUserIDs,
      domainPermission: domainPermission,
      color: domainColor,
    });
  },

  updateDomainDefaultCardView: function(domainID, defaultViewId) {
    AppDispatcher.dispatch({
      actionType: 'UPDATE_DOMAIN_DEFAULT_CARD_VIEW',
      domainID: domainID,
      defaultViewId: defaultViewId
    });
  }
};

export default DomainFormPageActions;
