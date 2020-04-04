import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import SSOForm from './sso_form';
import SharingSelectMenu from '../../shared/sharing_select_menu';
import PermissionsList from '../main_form_page/topic_tab_content/permissions_list';
import PeopleList from './people_list';
import DomainNameInputGroup from '../../shared/domain_name_input_group';
import tiphive from 'Lib/tiphive';
import { sortBy, compose, toLower, prop, filter, not, isNil } from 'ramda';
import { DEFAULT_COLOR } from 'Src/appConstants';

const sortByNameCaseInsensitive = compose(
  sortBy(compose(toLower, prop('name'))),
  filter(compose(not, isNil))
);

export class DomainTabContent extends Component {
  static propTypes = {
    domain: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string, // Personal domain
    ]),
    handleDomainFormSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    domain: null
  };

  state = {
    admins: []
  };

  componentDidMount() {
    $('.domain-selectize').selectize();
    if (this.props.domain !== null && !tiphive.isPublicDomain()) {
      const { relationships } = this.props.domain;
      const { roles } = relationships;
      this.setState(state => ({
        ...state,
        admins: sortByNameCaseInsensitive(
          roles.data.filter(role => role.name === 'admin').map(role => ({
            id: `users-${role.user_id}`,
            name: role.user_name
          }))
        )
      }));
    }
  }

  componentDidUpdate = ({ domain: prevDomain }) => {
    const { domain } = this.props;
    if (prevDomain !== domain  && !!domain && !tiphive.isPublicDomain()) {
      const { relationships } = domain;
      const { roles } = relationships;
      this.setState({
        admins: sortByNameCaseInsensitive(
          roles.data.filter(role => role.name === 'admin').map(role => ({
            id: `users-${role.user_id}`,
            name: role.user_name
          }))
        )
      });
    }
  }

  updateUserRole = (userId, userName, newRole, oldRole) => {
    const adminsForDomain = window.currentDomain.relationships.roles.data;

    if (newRole === 'admin') {
      window.currentDomain.relationships.roles.data = [
        ...adminsForDomain,
        {
          user_id: userId,
          user_name: userName,
          name: 'admin'
        }
      ];

      this.setState(state => ({
        ...state,
        admins: sortByNameCaseInsensitive([
          ...state.admins,
          {
            id: `users-${userId}`,
            name: userName
          }
        ])
      }));
    } else if (oldRole === 'admin') {
      window.currentDomain.relationships.roles.data = adminsForDomain.filter(
        role => role.user_id !== userId
      );

      this.setState(state => ({
        ...state,
        admins: sortByNameCaseInsensitive(
          state.admins.filter(admin => admin.id !== `users-${userId}`)
        )
      }));
    }
  };

  render() {
    const { props: { domain, handleDomainFormSubmit }, state: { admins } } = this;

    let domainIDHiddenInput = null,
      domainName = '',
      domainTenantName = '',
      disableTenantName = false,
      domainSSOEnabled = false,
      domainIDPEntityID = null,
      domainIDPSSOTargetURL = null,
      domainIDPSLOTargetURL = null,
      domainIssuer = null,
      permissionID = null,
      domainColor = '';

    let submitText = 'CREATE';
    let existingPermissions;

    if (domain) {
      const { attributes, relationships } = domain;
      const { domain_permission } = relationships;

      const permissions = domain_permission.data.access_hash;

      existingPermissions = permissions;

      domainIDHiddenInput = (
        <input
          type="hidden"
          name="domain[id]"
          id="domain_id"
          defaultValue={domain.id}
        />
      );

      domainName = attributes.name;
      domainTenantName = attributes.tenant_name;
      domainSSOEnabled = attributes.sso_enabled;
      domainIDPEntityID = attributes.idp_entity_id;
      domainIDPSSOTargetURL = attributes.idp_sso_target_url;
      domainIDPSLOTargetURL = attributes.idp_slo_target_url;
      domainIssuer = attributes.issuer;
      domainColor = attributes.color || DEFAULT_COLOR;

      disableTenantName = true;
      permissionID = relationships.domain_permission.data.id;

      submitText = 'UPDATE';
    }

    const submitButton = (
      <div className="navbar navbar-inverse navbar-fixed-bottom">
        <div className="container-fluid">
          <input
            onClick={handleDomainFormSubmit}
            type="submit"
            name="submit"
            className="btn btn-default navbar-btn"
            value={submitText}
            data-disable-with="Sending..."
          />
        </div>
      </div>);

    return (
      <div className="tab-pane active" role="tabpanel" id="domain-pane">
        <form
          className="main-form"
          id="main-domain-form"
          method="post"
        >
          {domainIDHiddenInput}
          <div
            id="carousel-domain-form"
            className="carousel"
            data-ride="carousel"
            data-interval="false"
          >
            <ul className="slide-indicators nav nav-pills main-form-content-nav">
              <li
                role="presentation"
                className="active"
                data-target="#carousel-domain-form"
                data-slide-to="0"
              >
                <a>General settings</a>
              </li>
              <li
                role="presentation"
                data-target="#carousel-domain-form"
                data-slide-to="1"
              >
                <a>SSO settings</a>
              </li>
              {domain && (
                <li
                  role="presentation"
                  data-target="#carousel-domain-form"
                  data-slide-to="2"
                >
                  <a>Administrators</a>
                </li>
              )}
              {domain && (
                <li
                  role="presentation"
                  data-target="#carousel-domain-form"
                  data-slide-to="3"
                >
                  <a>Permissions</a>
                </li>
              )}
              {domain && (
                <li
                  role="presentation"
                  data-target="#carousel-domain-form"
                  data-slide-to="4"
                >
                  <a>People</a>
                </li>
              )}
            </ul>

            <div className="carousel-inner" role="listbox">
              <div className="item active">
                <div className="panel-body">
                  <DomainNameInputGroup
                    componentClassName="concise"
                    domainPlaceholder="Workspace Name (Company or Team)"
                    tenantPlaceholder="Workspace URL"
                    domainDefaultValue={domainName}
                    tenantDefaultValue={domainTenantName}
                    disableTenantName={disableTenantName}
                    domainColorDefaultValue={domainColor}
                  />
                </div>
                <div className="navbar navbar-inverse navbar-fixed-bottom">
                  <div className="container-fluid">
                    <input
                      onClick={handleDomainFormSubmit}
                      type="submit"
                      name="submit"
                      className="btn btn-default navbar-btn"
                      value={submitText}
                      data-disable-with="Sending..."
                    />
                  </div>
                </div>
              </div>


              <SSOForm
                domainSSOEnabled={domainSSOEnabled}
                domainIDPEntityID={domainIDPEntityID}
                domainIDPSSOTargetURL={domainIDPSSOTargetURL}
                domainIDPSLOTargetURL={domainIDPSLOTargetURL}
                domainIssuer={domainIssuer}
                submitText={submitText}
              />

              { domain && (
                <Fragment>
                  <div className="item">
                    <div className="panel-body">
                      <SharingSelectMenu
                        update
                        sharingFor="admin"
                        sharableTypes={['User']}
                        sharingObject={domain}
                        selectTitle="Workspace administrators"
                        hasDefaultSharingItems={false}
                        selectedSharingItems={admins}
                      />
                    </div>
                    {submitButton}
                    
                  </div>

                  <div className="item">
                    <div className="panel-body">
                      <PermissionsList
                        permissionFor="domain"
                        objectName="Workspace"
                        currentDomain={window.currentDomain}
                        existingPermissions={existingPermissions}
                        permissionID={permissionID}
                      />
                    </div>
                    {submitButton}
                  </div>

                  <div className="item">
                    <div className="panel-body">
                      <PeopleList updateUserRole={this.updateUserRole} />
                    </div>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default DomainTabContent;
