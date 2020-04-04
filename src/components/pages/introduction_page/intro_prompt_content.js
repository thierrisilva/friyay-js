import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import LoadingIndicator from 'Src/components/shared/LoadingIndicator';
import TipHiveLogo from '../../shared/tiphive_logo';
import Auth from '../../../lib/auth';
import analytics from '../../../lib/analytics';
import DomainFormPageActions from '../../../actions/domain_form_page_actions';
import DomainFormPageStore from '../../../stores/domain_form_page_store';
import DomainNameInputGroup from '../../shared/domain_name_input_group';

class IntroPromptContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      domains: [],
      isSearchingDomain: false,
      submitDomainDisabled: false
    };

    this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
    this.onDomainCreate = this.onDomainCreate.bind(this);
  }

  componentDidMount() {
    var _this = this;
    DomainFormPageStore.addEventListener(
      window.DOMAIN_CREATE_EVENT,
      this.onDomainCreate
    );
  }

  componentWillUnmount() {
    DomainFormPageStore.removeEventListener(
      window.DOMAIN_CREATE_EVENT,
      this.onDomainCreate
    );
  }

  handleCreateFormSubmit(e) {
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
  }

  onDomainCreate(response) {
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

    this.setState({
      submitDomainDisabled: false
    });

    window.location.href =
      '//' + tenantName + '.' + window.APP_DOMAIN + '/introduction/explain_yay';
  }

  render() {
    const { userFirstName } = this.props;

    var messageName = '';
    if (userFirstName) {
      messageName = ', ' + userFirstName;
    }

    return (
      <div className="row no-gutter full-height team-domain width95">
        <div className="col-sm-12 full-height">
          <div className="row">
            <div className="col-sm-12 marginTop30">
              <TipHiveLogo />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-4 col-md-offset-4">
              <div className="join-section">
                <div className="onboarding-heading">
                  <h4 className="title">Sweet! Account created.</h4>
                </div>
                <div className="onboarding-heading">
                  <h4 className="title">Next, we'll create a Workspace.</h4>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-xs-12 marginTop30 padding0">
                    <form
                      action="/"
                      method="post"
                      onSubmit={this.handleCreateFormSubmit}
                    >
                      <div className="inputGroup">
                        <DomainNameInputGroup componentClassName="concise" />
                      </div>
                      <div className="form-group form-group-concise">
                        {this.state.submitDomainDisabled === 'disabled' && (
                          <LoadingIndicator />
                        )}
                        <button
                          type="submit"
                          className="createWorkspaceButton"
                          disabled={this.state.submitDomainDisabled}
                        >
                          <p>
                            Create Workspace{' '}
                            <i className="fa fa-long-arrow-right" />
                          </p>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-sm-12 col-xs-12 marginTop20 padding0">
                    <p className="sub-title">
                      We've already created a personal workspace for you as
                      well.
                    </p>
                    <Link
                      to="/introduction/explain_yay"
                      className="createWorkspaceNoButton"
                    >
                      Go to my Personal Workspace
                      <i className="fa fa-long-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default IntroPromptContent;
