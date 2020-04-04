import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QuickRightBarActions from 'Components/shared/assemblies/QuickRightBarActions';
import IconButton from 'Components/shared/buttons/IconButton';
import LoadingIndicator from 'Src/components/shared/LoadingIndicator';
import StarButton from 'Src/components/shared/topics/elements/StarButton';
import TopicActionsDropdown from 'Src/components/shared/topics/elements/TopicActionsDropdown';
import TopicTitleEditor from 'Src/components/shared/topics/elements/TopicTitleEditor';
import {
  setLeftSubtopicMenuOpenForTopic,
  toggleHexPanel
} from 'Src/newRedux/interface/menus/actions';
import { setUpdateTopicModalOpen } from 'Src/newRedux/interface/modals/actions';
import { clearSearchCardsResult } from 'Src/newRedux/database/search/actions';
import { searchCardsResult } from 'Src/newRedux/database/search/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import {
  getLeftPxFixedHeader,
  setTopicPanelView
} from 'Src/newRedux/interface/menus/thunks';
import Icon from 'Src/components/shared/Icon';
import {
  toggleSubtopicPanel,
  toggleSprintBar
} from 'Src/newRedux/interface/views/thunks';
import { GreyDots } from 'Src/components/shared/Dots';
import AddCardOrSubtopic from 'Components/shared/assemblies/AddCardOrSubtopic';
import { togglePriorityView } from 'Src/newRedux/utilities/actions';
import { yayDesign } from 'Src/lib/utilities';

class TopicHeader extends Component {
  static propTypes = {
    topic: PropTypes.object,
    displayLeftSubtopicMenuForTopic: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]),
    showHexButton: PropTypes.bool,
    setLeftSubtopicMenuOpenForTopic: PropTypes.func.isRequired,
    setUpdateTopicModalOpen: PropTypes.func.isRequired,
    setTopicPanelView: PropTypes.func.isRequired,
    myTopicsView: PropTypes.object,
    leftMenuOpen: PropTypes.bool,
    isWorkspaceListSidebarOpen: PropTypes.bool,
    getLeftPxFixedHeader: PropTypes.func.isRequired,
    toggleSubtopicPanel: PropTypes.func.isRequired,
    toggleSprintBar: PropTypes.func.isRequired,
    subtopicPanelVisible: PropTypes.bool,
    view: PropTypes.object,
    searchCardsResult: PropTypes.func.isRequired,
    clearSearchCardsResult: PropTypes.func.isRequired,
    active_design: PropTypes.any
  };

  constructor(props) {
    super(props);

    this.state = {
      topicNameEditMode: false,
      searchInput: false,
      query: ''
    };

    this.setTopicPanelView = props.setTopicPanelView;
    this.toggleHexPanel = props.toggleHexPanel;
    this.getLeftPxFixedHeader = props.getLeftPxFixedHeader;
    this.toggleSubtopicPanel = props.toggleSubtopicPanel;
    this.toggleSprintBar = props.toggleSprintBar;
    this.setUpdateTopicModalOpen = props.setUpdateTopicModalOpen;
    this.searchCardsResult = props.searchCardsResult;
    this.clearSearchCardsResult = props.clearSearchCardsResult;
    this.handleToggleTopicNameEditMode = this.handleToggleTopicNameEditMode.bind(
      this
    );
    this.handleToggleTopicSection = this.handleToggleTopicSection.bind(this);
    this.handleTopicViewSelect = this.handleTopicViewSelect.bind(this);
  }

  handleToggleTopicNameEditMode = () => {
    this.setState(state => ({ topicNameEditMode: !state.topicNameEditMode }));
  };

  handleToggleTopicSection = () => {
    const { topic } = this.props;
    this.toggleSubtopicPanel(topic);
  };

  handleToggleSprintBar = () => {
    const { topic } = this.props;
    this.toggleSprintBar(topic);
  };

  handleTopicViewSelect = topicViewMode => {
    const { subtopicPanelVisible, topic } = this.props;

    if (!subtopicPanelVisible) {
      this.toggleSubtopicPanel(topic);
    }

    this.setTopicPanelView(topicViewMode);
  };

  /**
   * Determine if cards visibility state hidden or not.
   *
   * @return {Boolean}
   */
  isCardsHidden = () => {
    const { topic, myTopicsView } = this.props;
    return (
      (myTopicsView && myTopicsView.cards_hidden) ||
      (topic && topic.attributes.cards_hidden)
    );
  };

  addNewTopic = () => {
    const { subtopicPanelVisible, toggleSubtopicPanel, topic } = this.props;
    !subtopicPanelVisible && toggleSubtopicPanel(topic);
    this.props.addNewTopic();
  };

  isTextCardVisible = () => {
    if (this.props.myTopicsView) {
      return ['BASIC'].includes(this.props.myTopicsView.view);
    }
    return false;
  };

  isUploadCardVisible = () => {
    if (this.props.myTopicsView) {
      return ['DOCUMENT'].includes(this.props.myTopicsView.view);
    }
  };

  handleClickSearch = () => {
    this.setState({
      searchInput: !this.state.searchInput
    });
  };

  /**
   * Handle change input query.
   *
   * @param {Event} e
   * @return  {Void}
   */
  handleChangeQ = e => {
    e.preventDefault();
    const { target } = e;
    const query = target.value;

    this.setState({
      query
    });

    // Prevent next action when user is typing
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      (async () => {
        try {
          query
            ? await this.searchCardsResult(query)
            : this.clearSearchCardsResult();
        } catch (err) {
          console.error(err);
        }
      })();
    }, 500);
  };

  // eslint-disable-next-line complexity
  render() {
    const {
      topic,
      displayLeftSubtopicMenuForTopic,
      setLeftSubtopicMenuOpenForTopic,
      myTopicsView,
      togglePriorityView,
      active_design
    } = this.props;
    const { topicNameEditMode, searchInput, query } = this.state;
    const { topicId } = displayLeftSubtopicMenuForTopic;
    const {
      card_font_color,
      banner_color_display,
      banner_image_display,
      banner_color,
      banner_image_url
    } = active_design || {};
    return (
      <header className="topic-header">
        {(banner_color_display && banner_color) ||
        (banner_image_display && banner_image_url) ? (
          <div
            style={{
              backgroundColor: banner_color,
              backgroundImage: banner_image_display
                ? `url('${banner_image_url}')`
                : '',
              height:
                banner_image_url && banner_image_display ? '250px' : '52px'
            }}
            className="topic-header-top-section"
          />
        ) : null}
        {topic ? (
          <Fragment>
            <div className="flex-r-center pr5 topic-header-main">
              <div className="flex-1 flex-r-center-center">
                <h1
                  className="m0 text-center"
                  onDoubleClick={this.handleToggleTopicNameEditMode}
                >
                  {topicNameEditMode ? (
                    <TopicTitleEditor
                      topic={topic}
                      onFinishEditing={this.handleToggleTopicNameEditMode}
                    />
                  ) : (
                    <span>{topic.attributes.title}</span>
                  )}
                </h1>
                <div className="topic-header_button-container dots-layer-container">
                  <GreyDots color={card_font_color} />
                  <IconButton
                    color={card_font_color || '#8b572a'}
                    icon="directions_run"
                    onClick={this.handleToggleSprintBar}
                    tooltip="Sprint Bar"
                    tooltipOptions={{ place: 'bottom' }}
                  />
                  <IconButton
                    additionalClasses="left-window-toggle"
                    color={card_font_color || '#2D9CDB'}
                    icon="chrome_reader_mode"
                    onClick={() =>
                      setLeftSubtopicMenuOpenForTopic(topicId ? null : topic.id)
                    }
                    tooltip="Left list menu"
                    tooltipOptions={{ place: 'bottom' }}
                  />
                  <IconButton
                    additionalClasses="subtopic-toggle"
                    color={card_font_color || '#F2994A'}
                    icon="chrome_reader_mode"
                    onClick={this.handleToggleTopicSection}
                    tooltip="yay list"
                    tooltipOptions={{ place: 'bottom' }}
                  />
                  {myTopicsView && myTopicsView.view === 'PRIORITIZE' ? (
                    <IconButton
                      onClick={togglePriorityView}
                      icon="web"
                      color={card_font_color || '#3B3155'}
                      tooltip="Sub View"
                      tooltipOptions={{ place: 'bottom' }}
                    />
                  ) : null}
                  <QuickRightBarActions
                    color={card_font_color}
                    tooltipOptions={{ place: 'bottom' }}
                  />
                  <StarButton color={card_font_color} topic={topic} />
                  <div
                    className="link-tooltip-container update-section"
                    onClick={() =>
                      this.props.setUpdateTopicModalOpen(topic.id, true, 1)
                    }
                  >
                    <div
                      style={{
                        color: card_font_color || '#9B51E0'
                      }}
                      className="material-icons"
                    >
                      person_add
                    </div>
                    <span className="link-tooltip top">Share yay</span>
                  </div>
                  <div className="yay-search-form">
                    <button
                      className="btn-like-search-form"
                      onClick={this.handleClickSearch}
                    >
                      <Icon
                        icon="search"
                        fontAwesome
                        color={card_font_color || '#63a0c3'}
                      />
                    </button>
                    {searchInput && (
                      <input
                        type="text"
                        value={query}
                        className="add-search-input"
                        name="q"
                        onChange={this.handleChangeQ}
                        autoFocus
                        autoComplete={'off'}
                      />
                    )}
                  </div>
                  <TopicActionsDropdown
                    color={card_font_color}
                    topic={topic}
                    cardsHidden={this.isCardsHidden()}
                    onRenameTopicSelected={this.handleToggleTopicNameEditMode}
                    withoutAddImage
                    addNewTopic={this.addNewTopic}
                  />
                </div>
                <div className="view-top-bar_element">
                  <AddCardOrSubtopic
                    color={card_font_color}
                    topic={topic}
                    displayAddCardButton
                    displayAddSubtopicButton
                    showAddTextCard={this.isTextCardVisible()}
                    showUploadFileCard={this.isUploadCardVisible()}
                  />
                </div>
              </div>
            </div>
            {topic.attributes.description && (
              <div className="row">
                <h4 className="text-center text-muted">
                  {topic.attributes.description}
                </h4>
              </div>
            )}
          </Fragment>
        ) : (
          <LoadingIndicator />
        )}
      </header>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const { user, page } = sm;
  const uiSettings = user.attributes.ui_settings;
  const myTopicsView = uiSettings.my_topics_view.find(
    view => view.id === page.topicId
  );
  const leftMenuOpen = uiSettings.left_menu_open;
  const subtopicPanelVisible =
    myTopicsView && myTopicsView.subtopic_panel_visible;
  const active_design = yayDesign(page.topicId, sm.topics[page.topicId]);

  return {
    displayLeftSubtopicMenuForTopic: sm.menus.displayLeftSubtopicMenuForTopic,
    isWorkspaceListSidebarOpen: sm.menus.isWorkspaceListSidebarOpen,
    myTopicsView,
    leftMenuOpen,
    subtopicPanelVisible,
    active_design
  };
};

const mapDispatch = {
  setLeftSubtopicMenuOpenForTopic,
  setUpdateTopicModalOpen,
  toggleHexPanel,
  setTopicPanelView,
  getLeftPxFixedHeader,
  toggleSubtopicPanel,
  toggleSprintBar,
  searchCardsResult,
  clearSearchCardsResult,
  togglePriorityView
};

export default connect(
  mapState,
  mapDispatch
)(TopicHeader);
