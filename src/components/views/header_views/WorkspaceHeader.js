import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { setUserInvitationModalOpen } from 'Src/newRedux/interface/modals/actions';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { getThisDomain } from 'Src/lib/utilities';
import { getDomains } from 'Src/newRedux/database/domains/selectors';
import DomainLogo from 'Src/components/shared/DomainLogo';
import {
  getLeftPxFixedHeader,
  setDomainSubtopicsView
} from 'Src/newRedux/interface/menus/thunks';
import { toggleHexPanel } from 'Src/newRedux/interface/menus/actions';
import { setUpdateTopicModalOpen } from 'Src/newRedux/interface/modals/actions';
import { toggleWorkspaceTopicsPanel } from 'Src/newRedux/interface/views/thunks';
import { GreyDots } from 'Src/components/shared/Dots';
import { setEditDomainModalOpen } from 'Src/newRedux/interface/modals/actions';
import IconButton from 'Src/components/shared/buttons/IconButton';
import Ability from 'Src/lib/ability';

class WorkspaceHeader extends Component {
  static propTypes = {
    domains: PropTypes.array.isRequired,
    setUserInvitationModalOpen: PropTypes.func.isRequired,
    user: PropTypes.object,
    getLeftPxFixedHeader: PropTypes.func.isRequired,
    setUpdateTopicModalOpen: PropTypes.func.isRequired,
    toggleHexPanel: PropTypes.func.isRequired,
    subtopicsPanelView: PropTypes.string.isRequired,
    topicMinimized: PropTypes.bool,
    setDomainSubtopicsView: PropTypes.func.isRequired,
    toggleWorkspaceTopicsPanel: PropTypes.func.isRequired,
    topicsPanelVisible: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.toggleHexPanel = props.toggleHexPanel;
    this.getLeftPxFixedHeader = props.getLeftPxFixedHeader;
    this.setUserInvitationModalOpen = props.setUserInvitationModalOpen;
    this.setDomainSubtopicsView = props.setDomainSubtopicsView;
    this.toggleWorkspaceTopicsPanel = props.toggleWorkspaceTopicsPanel;
  }

  /**
   * Get the current domain name
   *
   * @return {Object}
   */
  getCurrentDomain = () => {
    const { domains } = this.props;
    const thisDomain = getThisDomain(domains);
    window.currentDomain = thisDomain;

    return thisDomain;
  };

  handleToggleTopicNameEditMode = () => {
    this.setState(state => ({ topicNameEditMode: !state.topicNameEditMode }));
  };

  render() {
    const {
      user,
      setUserInvitationModalOpen,
      setEditDomainModalOpen
    } = this.props;
    const domain = this.getCurrentDomain();
    const leftPx = this.getLeftPxFixedHeader();

    return (
      <header className="topic-header" style={{ left: leftPx }}>
        <div className="flex-r-center pr5 topic-header-main">
          <div className="flex-r-center-start h1-container">
            <h1 className="m0 text-center workspace-header">
              <DomainLogo
                name={domain.attributes.name}
                domain={domain}
                componentClass={'topic-header__domain-icon'}
              />
              <span>{domain.attributes.name}</span>
            </h1>
          </div>
          {domain.attributes.tenant_name != 'my' && (
            <div className="dots-layer-container flex-r-center-center  update-section">
              <GreyDots />
              <div
                className="link-tooltip-container"
                onClick={() => setUserInvitationModalOpen(user.id)}
              >
                <div className="material-icons grey-icon-button">share</div>
                <span className="link-tooltip bottom">Share Workspace</span>
              </div>
              <div className="link-tooltip-container">
                {Ability.can('update', 'self', window.currentDomain) &&
                  window.currentDomain.id !== '0' && (
                    <IconButton
                      fontAwesome
                      icon="cog"
                      onClick={() => setEditDomainModalOpen(true)}
                    />
                  )}
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const { user } = sm;
  const uiSettings = user.attributes.ui_settings;
  const subtopicsPanelView = uiSettings.subtopics_panel_view || 'HEX';
  const topicsPanelVisible = uiSettings.topics_panel_visible;

  return {
    user: sm.user,
    topicMinimized: !sm.menus.displayHexPanel,
    subtopicsPanelView,
    domains: getDomains(state),
    topicsPanelVisible
  };
};

const mapDispatch = {
  setEditDomainModalOpen,
  setUserInvitationModalOpen,
  getLeftPxFixedHeader,
  setUpdateTopicModalOpen,
  toggleHexPanel,
  setDomainSubtopicsView,
  toggleWorkspaceTopicsPanel
};

export default connect(
  mapState,
  mapDispatch
)(WorkspaceHeader);
