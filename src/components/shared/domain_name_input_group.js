import React, { Component } from 'react';
import ColorPicker from 'rc-color-picker';
import PropTypes from 'prop-types';
import Inflection from 'inflection';
import { DEFAULT_COLOR } from 'Src/appConstants';

import 'rc-color-picker/assets/index.css';

class DomainNameInputGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      domainName: '',
      tenantName: '',
      timeout: null,
      domainColor: DEFAULT_COLOR
    };

    this.handleTimerExpire = this.handleTimerExpire.bind(this);
    this.handleTenantNameChange = this.handleTenantNameChange.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  componentDidMount() {
    const {
      domainDefaultValue,
      tenantDefaultValue,
      domainColorDefaultValue
    } = this.props;

    this.setState({
      domainName: domainDefaultValue,
      tenantName: tenantDefaultValue,
      domainColor: domainColorDefaultValue
    });
  }

  handleTimerExpire(domainNameValue) {
    const tenantName = Inflection.dasherize(domainNameValue.toLowerCase());

    this.setState({
      tenantName: tenantName
    });
  }

  handleTenantNameChange(event) {
    this.setState({ tenantName: event.target.value });
  }

  resetTimer(event) {
    const _this = this;
    const _value = event.target.value;
    // Clear the timeout if it has already been set.
    // This will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(this.state.timeout);

    // Make a new timeout set to go off in 800ms
    this.setState({
      domainName: _value,
      timeout: setTimeout(() => _this.handleTimerExpire(_value), 500)
    });
  }

  /**
   * On color picker color change event handler.
   *
   * @return {Void}
   */
  handleColorChange = colors => {
    this.setState({
      domainColor: colors.color
    });
  };

  render() {
    const {
      disableTenantName,
      domainPlaceholder,
      tenantPlaceholder
    } = this.props;

    const { domainName, tenantName, domainColor } = this.state;

    return (
      <div
        className={`domain-name-input-group ${this.props.componentClassName}`}
      >
        <div className="form-group">
          <input
            value={domainName}
            onChange={this.resetTimer}
            type="text"
            id="domain_name"
            name="domain[name]"
            className="form-control"
            placeholder={domainPlaceholder}
            required
          />
          <span className="separator" />
        </div>

        <div className="form-group">
          <div className="input-group">
            <input
              value={tenantName}
              onChange={this.handleTenantNameChange}
              className="form-control"
              type="text"
              id="domain_tenant_name"
              name="domain[tenant_name]"
              placeholder={tenantPlaceholder}
              aria-describedby="domain-addon"
              required
              pattern="^[a-z0-9][a-z0-9-]{0,60}[a-z0-9]$"
              title="Workspace must only be lowercase letters, 0-9 and hyphens"
              disabled={disableTenantName}
            />
            <span className="input-group-addon" id="domain-addon">
              .{window.APP_DOMAIN}
            </span>
          </div>
          <div className="form-group color-picker-group">
            <label className="form-label">Workspace color</label>
            <div className="workspace-color-picker-container">
              <ColorPicker
                color={domainColor}
                onChange={this.handleColorChange}
                style={{ zIndex: 3000 }}
              />
              <input type="hidden" id="domain_color" value={domainColor} />
            </div>
          </div>
          <span className="separator" />
        </div>
      </div>
    );
  }
}

DomainNameInputGroup.defaultProps = {
  domainPlaceholder: 'Workspace name (company, team, project, etc)',
  tenantPlaceholder: 'workspace-url',
  disableTenantName: false
};

DomainNameInputGroup.propTypes = {
  disableTenantName: PropTypes.bool,
  domainPlaceholder: PropTypes.string,
  tenantPlaceholder: PropTypes.string,
  componentClassName: PropTypes.string,
  domainDefaultValue: PropTypes.string,
  tenantDefaultValue: PropTypes.string,
  domainColorDefaultValue: PropTypes.string
};

export default DomainNameInputGroup;
