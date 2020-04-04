import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DomainFormPageActions from '../../actions/domain_form_page_actions';
import DomainFormPageStore from '../../stores/domain_form_page_store';
import PageModal from './page_modal';
import DomainTabContent from './domain_form_page/domain_tab_content';
import analytics from 'Lib/analytics';
import { createDomain } from 'Src/newRedux/database/domains/thunks';

import { getDomainUrl, timeout } from 'Lib/utilities';

class DomainFormPage extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired
  };

  state = {
    loading: false
  }

  handleDomainFormSubmit = async( e ) => {
    !!e && e.preventDefault();
    this.setState({ loading: true });
    await timeout( 500 );  //in case user presses enter before tenant name is set from domain name

    const domainName = $('#main-domain-form #domain_name').val().trim();
    const domainTenantName = $('#main-domain-form #domain_tenant_name').val().trim();
    // const domainSSOSettings = {
    //   domainSSOEnabled: $('#main-domain-form #domain_sso_enabled').val(),
    //   domainIDPEntityID: $('#main-domain-form #domain_idp_entity_id').val().trim(),
    //   domainIDPSSOTargetURL: $('#main-domain-form #domain_idp_sso_target_url').val().trim(),
    //   domainIDPSLOTargetURL: $('#main-domain-form #domain_idp_slo_target_url').val().trim(),
    //   domainIssuer: $('#main-domain-form #domain_issuer').val().trim()
    // };

    // const adminUserIDs = $('#main-domain-form #admin_sharing_item_ids').val();
    // const accessHash = [...document.querySelectorAll('select[name^="domain-permissions"]')]
    //   .reduce((access, el) => {
    //     const $elem = $(el);
    //     const action = $elem.data('action');
    //     const permissionValue = $elem.val();
    //
    //     access[action] = {
    //       roles: permissionValue || {}
    //     };
    //
    //     return access;
    //   }, {});
    //
    // const domainPermission = { access_hash: accessHash };
    //
    // DomainFormPageActions.createDomain(
    //   domainName,
    //   domainTenantName,
    //   domainSSOSettings,
    //   adminUserIDs,
    //   domainPermission
    // );

    const attributes = {
      name: domainName,
      tenant_name: domainTenantName
    }

    const newDomain = await this.props.createDomain({ attributes });
    const domainUrl = getDomainUrl( newDomain.data.data );
    this.setState({ loading: false });
    window.location.href = domainUrl;
    this.props.onClose();
  };


  onDomainCreate = ({ data }) => {
    const tenantName = data.attributes.tenant_name;

    analytics.track('Workspace(Domain) Created');

    window.location.href = '//' + tenantName + '.' + window.APP_DOMAIN;
  };


  render() {
    const { props: { onClose } } = this;

    return (
      <PageModal
        size="domain"
        anim="slide"
        backdrop="static"
        keyboard={false}
        onClose={onClose}
      >
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <a
              className="btn btn-link btn-close-side-left"
              data-dismiss="modal"
              onClick={onClose}
            >
              <i className="fa fa-times" />
            </a>

            <ul className="nav navbar-nav" role="tablist">
              <li role="presentation" className="active">
                <a
                  href="#domain-pane"
                  aria-controls="home"
                  role="tab"
                  data-toggle="tab"
                >
                  CREATE WORKSPACE
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="tab-content" id="main-form-tab-content">
          <DomainTabContent
            handleDomainFormSubmit={this.handleDomainFormSubmit}
          />
        </div>
      </PageModal>
    );
  }
}


const mapDispatch = {
  createDomain
}


export default connect( null, mapDispatch )( DomainFormPage );
