import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContactUsBanner from '../../shared/contact_us_banner';

class SSOForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let formClassName = '';
    let bannerComponent = '';

    if (this.props.domainSSOEnabled === true) {
      formClassName = 'form-fields';
    } else {
      formClassName = 'form-fields hide';
      bannerComponent = (
        <ContactUsBanner
          email="support@friyay.io"
          msg="to setup your Workspace with Single Sign On"
        />
      );
    }

    return (
      <div className="item">
        <div className="panel-body">
          {bannerComponent}
          <div className={formClassName}>
            <div className="form-group">
              <div className="row">
                <div className="col-sm-4 control-label">
                  <label>Enable SSO</label>
                </div>

                <div className="col-sm-8">
                  <select
                    id="domain_sso_enabled"
                    name="domain[sso_enabled]"
                    className="form-control domain-selectize"
                    placeholder="Enable SSO"
                    ref="domainSSOEnabled"
                    defaultValue={this.props.domainSSOEnabled}
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-4 control-label">
                  <label>IDP Entity ID</label>
                </div>

                <div className="col-sm-8">
                  <input
                    type="text"
                    id="domain_idp_entity_id"
                    name="domain[idp_entity_id]"
                    className="form-control"
                    placeholder="IDP Entity ID"
                    ref="domainIDPEntityID"
                    defaultValue={this.props.domainIDPEntityID}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-4 control-label">
                  <label>IDP SSO Target URL</label>
                </div>

                <div className="col-sm-8">
                  <input
                    type="text"
                    id="domain_idp_sso_target_url"
                    name="domain[idp_sso_target_url]"
                    className="form-control"
                    placeholder="IDP SSO Target URL"
                    ref="domainIDPSSOTargetURL"
                    defaultValue={this.props.domainIDPSSOTargetURL}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-4 control-label">
                  <label>IDP SLO Target URL</label>
                </div>

                <div className="col-sm-8">
                  <input
                    type="text"
                    id="domain_idp_slo_target_url"
                    name="domain[idp_slo_target_url]"
                    className="form-control"
                    placeholder="IDP SLO Target URL"
                    ref="domainIDPSLOTargetURL"
                    defaultValue={this.props.domainIDPSLOTargetURL}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-4 control-label">
                  <label>Issuer</label>
                </div>

                <div className="col-sm-8">
                  <input
                    type="text"
                    id="domain_issuer"
                    name="domain[issuer]"
                    className="form-control"
                    placeholder="Issuer"
                    ref="domainIssuer"
                    defaultValue={this.props.domainIssuer}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*End Panel*/}

        <div className="navbar navbar-inverse navbar-fixed-bottom">
          <div className="container-fluid">
            <input
              type="submit"
              name="submit"
              className="btn btn-default navbar-btn"
              value={this.props.submitText}
              data-disable-with="Sending..."
            />
          </div>
        </div>
      </div>
    );
  }
}

SSOForm.propTypes = {
  domainSSOEnabled: PropTypes.bool,
  domainIDPEntityID: PropTypes.string,
  domainIDPSSOTargetURL: PropTypes.string,
  domainIDPSLOTargetURL: PropTypes.string,
  domainIssuer: PropTypes.string,
  submitText: PropTypes.string
};

export default SSOForm;
