import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Icon from 'Src/components/shared/Icon';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { getThisDomain, getDomainUrl } from 'Src/lib/utilities';
import DomainLogo from 'Src/components/shared/DomainLogo';
import { toggleLeftMenu } from 'Src/newRedux/interface/menus/thunks';
import DomainFormPage from 'Src/components/pages/domain_form_page';

const DomainLink = ({ domain, thisDomain }) => {
  const domainUrl = getDomainUrl(domain);
  const { name } = domain.attributes;

  return (
    <li>
      <a className="left-menu-domain-segment_domain-link" href={domainUrl}>
        <DomainLogo name={name} domain={domain} /> {name}
      </a>
    </li>
  );
};

class WorkspaceDropdown extends Component {
  static propTypes = {
    displayLeftMenu: PropTypes.bool,
    domains: PropTypes.array.isRequired,
    toggleLeftMenu: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false,
      isCreateDomainOpen: false
    };
  }

  onKeepMenuOpen = event => {
    this.handleToggleLeftMenu();
  };

  handleToggleLeftMenu = () =>
    this.props.toggleLeftMenu(!this.props.displayLeftMenu);

  handleDocClick = ev => {
    if (this.dropdownRef && !this.dropdownRef.contains(ev.target)) {
      this.handleToggleDropdownClick();
    }
  };

  handleToggleDropdownClick = () => {
    this.setState(
      {
        isDropdownOpen: !this.state.isDropdownOpen
      },
      () => {
        if (this.state.isDropdownOpen) {
          document.addEventListener('click', this.handleDocClick, false);
        } else {
          document.removeEventListener('click', this.handleDocClick, false);
        }
      }
    );
  };

  saveDropdownRef = ref => {
    this.dropdownRef = ref;
  };

  render() {
    const { displayLeftMenu, domains } = this.props;
    const { isDropdownOpen } = this.state;
    const thisDomain = getThisDomain(domains);

    return (
      <span
        className={classNames(isDropdownOpen && 'open')}
        ref={this.saveDropdownRef}
      >
        <a onClick={this.handleToggleDropdownClick}>
          <span className="caret" />
        </a>
        <ul className="dropdown-menu assigned-user-list">
          <li>
            <Link
              className="breadcrumb-domain-segment_domain-link"
              to="/choose_domain"
            >
              <Icon icon="chevron_left" /> All workspaces
            </Link>
          </li>
          {domains.map(dom => (
            <DomainLink
              domain={dom}
              key={`domainLink-${dom.id}`}
              thisDomain={thisDomain}
            />
          ))}
          <li>
            <div className="text-center mt10 mb2">
              <a
                className="btn btn-default btn-alt btn-alt-sm pl10 pr10"
                onClick={() =>
                  this.setState(
                    { isCreateDomainOpen: true },
                    this.handleToggleDropdownClick()
                  )
                }
              >
                CREATE WORKSPACE
              </a>
            </div>
          </li>
          <li>
            <a className="caption" onClick={this.onKeepMenuOpen}>
              Keep menu open
            </a>
          </li>
        </ul>
        {this.state.isCreateDomainOpen && (
          <DomainFormPage
            onClose={() => this.setState({ isCreateDomainOpen: false })}
          />
        )}
      </span>
    );
  }
}

const mapState = state => ({
  displayLeftMenu: stateMappings(state).menus.displayLeftMenu
});

const mapDispatch = {
  toggleLeftMenu
};

export default connect(
  mapState,
  mapDispatch
)(WorkspaceDropdown);
