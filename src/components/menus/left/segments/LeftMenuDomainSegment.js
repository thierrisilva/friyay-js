import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { yayDesign } from 'Src/lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { getThisDomain, getDomainUrl } from 'Src/lib/utilities';
import { setEditDomainModalOpen } from 'Src/newRedux/interface/modals/actions';
import { getDomains } from 'Src/newRedux/database/domains/selectors';
import { toggleWorkspaceListSidebar } from 'Src/newRedux/interface/menus/thunks';
import Ability from 'Src/lib/ability';
import Icon from 'Src/components/shared/Icon';
import IconButton from 'Src/components/shared/buttons/IconButton';
import DomainFormPage from 'Src/components/pages/domain_form_page';
import DomainLogo from 'Src/components/shared/DomainLogo';

const DomainLink = ({ domain }) => {
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

class LeftMenuDomainSegment extends Component {
  static propTypes = {
    domains: PropTypes.array.isRequired,
    toggleWorkspaceListSidebar: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isCreateDomainOpen: false
    };

    this.toggleWorkspaceListSidebar = props.toggleWorkspaceListSidebar;
  }

  getDomainLink = ({ domain }) => {
    const domainUrl = getDomainUrl(domain);

    return (
      <li>
        <a className="left-menu-domain-segment_domain-link" href={domainUrl}>
          {domain.attributes.name}
        </a>
      </li>
    );
  };

  render() {
    const { domains, setEditDomainModalOpen, active_design = {} } = this.props; //eslint-disable-line
    const thisDomain = getThisDomain(domains);
    window.currentDomain = thisDomain;

    const domainName = thisDomain.attributes.name || '';
    // const DomainLink = this.getDomainLink;
    const { workspace_font_color } = active_design;
    return (
      <div className="left-menu-domain-segment">
        <div
          className="container-fluid pr0"
          id="tour-step-1"
          ref={div => (this.tourPoint = div)}
        >
          <div className="navbar-header flex-r-center full-width">
            <DomainLogo
              name={domainName}
              domain={thisDomain}
              componentClass={'left-menu__domain-icon'}
            />
            <Link to="/" className="left-menu-domain-segment_root-domain-link">
              {domainName}
            </Link>

            <ul className="nav navbar-nav">
              <li className="dropdown">
                <a
                  className="dropdown-toggle dark-grey-link yellow-hover"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <Icon icon="arrow_drop_down" color={workspace_font_color} />
                </a>
                <ul
                  className="dropdown-menu assigned-user-list"
                  id="domain-dropdown"
                >
                  <li>
                    <Link
                      className="left-menu-domain-segment_domain-link"
                      to="/choose_domain"
                    >
                      <Icon icon="chevron_left" color={workspace_font_color} />{' '}
                      All workspaces
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
                          this.setState({ isCreateDomainOpen: true })
                        }
                      >
                        CREATE WORKSPACE
                      </a>
                    </div>
                  </li>
                  <li>
                    <a
                      className="caption"
                      onClick={this.toggleWorkspaceListSidebar}
                    >
                      Keep menu open
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            {Ability.can('update', 'self', window.currentDomain) &&
              window.currentDomain.id !== '0' && (
                <IconButton
                  color={workspace_font_color}
                  fontAwesome
                  icon="cog"
                  onClick={() => setEditDomainModalOpen(true)}
                  additionalClasses="dark-grey-icon-button mlauto"
                />
              )}
          </div>
        </div>
        {this.state.isCreateDomainOpen && (
          <DomainFormPage
            onClose={() => this.setState({ isCreateDomainOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const {
    menus,
    page: { topicId },
    topics
  } = sm;
  const active_design = yayDesign(topicId, topics[topicId]);
  return {
    active_design,
    domains: getDomains(state),
    isWorkspaceListSidebarOpen: menus.isWorkspaceListSidebarOpen
  };
};

const mapDispatch = {
  setEditDomainModalOpen,
  toggleWorkspaceListSidebar
};

export default connect(
  mapState,
  mapDispatch
)(LeftMenuDomainSegment);
