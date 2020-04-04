import React, { Component } from 'react';
import createClass from 'create-react-class';
import inflection from 'inflection';

import DomainFormPageActions from '../../../actions/domain_form_page_actions';
import DomainFormPageStore from '../../../stores/domain_form_page_store';

import Auth from '../../../lib/auth';
import APIRequest from '../../../lib/ApiRequest';
import analytics from '../../../lib/analytics';

import SideAWrapper from './SideAWrapper';

import DomainNameInputGroup from '../../shared/domain_name_input_group';

var IntroTeamContent = createClass({
  getInitialState: function() {
    return {
      domains: [],
      isSearchingDomain: false,
      isSubmitting: false,
      domainButtonText: 'Create Workspace',
      submitDomainDisabled: false
    };
  },

  componentDidMount: function() {
    var _this = this;
    DomainFormPageStore.addEventListener(
      window.DOMAIN_CREATE_EVENT,
      this.onDomainCreate
    );
  },

  componentWillUnmount: function() {
    DomainFormPageStore.removeEventListener(
      window.DOMAIN_CREATE_EVENT,
      this.onDomainCreate
    );
  },

  handleDomainJoin: function(domain) {
    var domainID = domain.id;
    var domainName = domain.attributes.name;
    var tenantName = domain.attributes.tenant_name;
    var joinType = domain.attributes.join_type;

    var $joinXHR;
    switch (joinType) {
      case 'invitation_required1':
        vex.dialog.alert({
          message: 'This Workspace requires invitation.'
        });
        break;

      default:
        if ($joinXHR) {
          $joinXHR.abort();
        }

        $joinXHR = APIRequest.post({
          resource: 'domains/' + tenantName + '/join'
        });

        $joinXHR
          .done(function(response, status, xhr) {
            analytics.track('Workspace(Domain) Joined');

            window.location.href =
              '//' +
              tenantName +
              '.' +
              window.APP_DOMAIN +
              '/introduction/get_started';

            APIRequest.showSuccessMessage(
              'Joined ' + domainName + ' Workspace successfully'
            );
          })
          .fail(function(xhr, status, error) {
            var errorMessage = '';
            if (xhr.responseJSON && xhr.responseJSON.errors) {
              errorMessage = '. ' + xhr.responseJSON.errors.detail + '.';
            }

            APIRequest.showErrorMessage(
              'Failed to join ' + domainName + ' Workspace' + errorMessage
            );
          });
    }
  },

  handleCreateFormSubmit: function(e) {
    e.preventDefault();
    var $domainForm = $(e.target);

    var domainName = $domainForm
      .find('#domain_name')
      .val()
      .trim();
    var domainTenantName = $domainForm
      .find('#domain_tenant_name')
      .val()
      .trim();

    var domainSSOSettings = {
      domainSSOEnabled: false,
      domainIDPEntityID: null,
      domainIDPSSOTargetURL: null,
      domainIDPSLOTargetURL: null,
      domainIssuer: null
    };

    this.setState({
      isSubmitting: true,
      domainButtonText: 'Creating Team Workspace...',
      submitDomainDisabled: 'disabled'
    });

    DomainFormPageActions.createDomain(
      domainName,
      domainTenantName,
      domainSSOSettings,
      null,
      null
    );
  },

  onDomainCreate: function(response) {
    if (!response || !response.data) {
      this.setState({
        isSubmitting: false,
        domainButtonText: 'Create Workspace',
        submitDomainDisabled: false
      });

      return false;
    }

    var domain = response.data;
    var domainName = domain.attributes.name;
    var tenantName = domain.attributes.tenant_name;

    Auth.setCookie('domainName', domainName);

    analytics.track('Workspace(Domain) Created');

    window.location.href =
      '//' + tenantName + '.' + window.APP_DOMAIN + '/introduction/create_hive';
  },

  render: function() {
    const { userFirstName } = this.props;
    const { domains, isSearchingDomain } = this.state;

    var _this = this;

    var domainsSearchContent;
    var domainRows = [];
    if (domains.length > 0) {
      $(domains).each(function(index, domain) {
        var domainRow = (
          <tr key={'domain-' + domain.id}>
            <td>
              {domain.attributes.name}
              <span className="pull-right">
                <a
                  href="javascript:void(0)"
                  className="btn btn-default"
                  onClick={function(e) {
                    e.preventDefault();
                    _this.handleDomainJoin(domain);
                  }}
                >
                  JOIN WORKSPACE
                </a>
              </span>
            </td>
          </tr>
        );

        domainRows.push(domainRow);
      });

      domainsSearchContent = (
        <div className="form-group text-left">
          <p>
            <strong>Found following organizations:</strong>
          </p>
          <table className="table">
            <tbody>{domainRows}</tbody>
          </table>
        </div>
      );
    }

    if (isSearchingDomain) {
      domainsSearchContent = <img src="/images/ajax-loader.gif" />;
    }

    var messageName = '';
    if (userFirstName) {
      messageName = ', ' + userFirstName;
    }

    var topMessage =
      'Ok' + messageName + ", let's create a Workspace for your team";

    return (
      <div className="row no-gutter full-height">
        <SideAWrapper topMessage={topMessage} title={'Create a Workspace'}>
          <form action="/" method="post" onSubmit={this.handleCreateFormSubmit}>
            <DomainNameInputGroup componentClassName="concise" />

            <div className="form-group form-group-concise">
              <button
                type="submit"
                className="btn btn-block btn-intro"
                disabled={this.state.submitDomainDisabled}
              >
                {this.state.domainButtonText}
                <i className="fa fa-long-arrow-right pull-right" />
              </button>
            </div>
          </form>
        </SideAWrapper>
      </div>
    );
  }
});

export default IntroTeamContent;
