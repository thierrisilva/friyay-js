import PropTypes from "prop-types"
import React from "react";
import { connect } from "react-redux";

import DomainLogo from "Src/components/shared/DomainLogo";
import Icon from "Src/components/shared/Icon";
import { getDomainUrl } from 'Src/lib/utilities';
import { getDomains } from 'Src/newRedux/database/domains/selectors';
import { toggleWorkspaceListSidebar } from "Src/newRedux/interface/menus/thunks";
import { stateMappings } from 'Src/newRedux/stateMappings';

const WorkspaceItem = ({ domain }) => {
  const { attributes } = domain;
  const { name } = attributes;
  const domainUrl = getDomainUrl( domain );
  
  return (
    <div className="workspace-item">
      <span><DomainLogo name={name} domain={domain} /></span>
      <a href={domainUrl}>{name}</a>
    </div>
  );
}

class WorkspacesMenu extends React.Component {
  static propTypes = {
    domains: PropTypes.array.isRequired,
    displayMenu: PropTypes.bool,
    isWorkspaceListSidebarOpen: PropTypes.bool,
    toggleWorkspaceListSidebar: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.toggleWorkspaceListSidebar = props.toggleWorkspaceListSidebar;
  }

  /**
   * Render workspace list
   * 
   * @param {[Object]} domains
   * @return {[DOM]}
   */
  renderWorkspaceList(domains = []) {
    return domains.map((domain) => {
      return (<WorkspaceItem key={`domain-item-${domain.id}`} domain={domain} />)
    });
  }

  render() {
    const { domains, displayMenu, isWorkspaceListSidebarOpen } = this.props;
    const workspaceListSidebarClasses =
      (!displayMenu || !isWorkspaceListSidebarOpen) 
        ? 'workspace-collection relative'
        : `workspace-collection relative ${isWorkspaceListSidebarOpen && 'in-focus'}` ;

    return (
      <div className={workspaceListSidebarClasses}>
        <h4 onClick={this.toggleWorkspaceListSidebar}>Workspaces <span><Icon fontAwesome icon={'chevron-left'} /></span></h4>
        { this.renderWorkspaceList(domains) }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const sm = stateMappings( state );
  return {
    domains: getDomains(state),
    displayMenu: sm.menus.displayLeftMenu,
    isWorkspaceListSidebarOpen: sm.menus.isWorkspaceListSidebarOpen,
  }
}

const mapDispatchToProps = {
  toggleWorkspaceListSidebar,
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspacesMenu);
