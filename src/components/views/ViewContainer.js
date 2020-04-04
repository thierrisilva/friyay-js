import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getRelevantViewForPage } from 'Src/newRedux/interface/views/selectors';
import RightActionBarContainer from 'Src/components/menus/right/RightActionBarContainer';
import ErrorBoundary from 'Src/components/shared/errors/ErrorBoundary';
import DynamicHeaderContainer from 'Components/views/DynamicHeaderContainer';
import DynamicTopicContainer from 'Components/views/DynamicTopicContainer';
import DynamicCardContainer from 'Components/views/DynamicCardContainer';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import { toggleSubtopicPanel } from 'Src/newRedux/interface/views/thunks';
import { updateSelectedCard } from 'Src/newRedux/database/user/thunks';
import { GREY_VIEW } from 'AppConstants';
import { withRouter } from 'react-router-dom';
import { yayDesign } from 'Src/lib/utilities';
import SprintBar from 'Components/shared/topics/SprintBar';
class ViewContainer extends React.Component {
  static propTypes = {
    cards: PropTypes.array,
    cardRequirements: PropTypes.object,
    displayCards: PropTypes.bool,
    displayTopics: PropTypes.bool,
    headerView: PropTypes.string,
    page: PropTypes.string,
    subtopics: PropTypes.array,
    topic: PropTypes.object,
    topicRequirements: PropTypes.object,
    viewKey: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    displayRightSubMenuForMenu: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    domainTopicsPanelView: PropTypes.string,
    topicView: PropTypes.string,
    cardView: PropTypes.string,
    isFileDragged: PropTypes.bool,
    cardsHiddenInWorkspace: PropTypes.bool,
    views: PropTypes.object,
    additionalCssClasses: PropTypes.string,
    toggleSubtopicPanel: PropTypes.func.isRequired,
    active_design: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.toggleSubtopicPanel = props.toggleSubtopicPanel;
    this.state = {
      showAddTopicInput: false
    };
  }

  handleToggleTopicSection = () => {
    const { topic } = this.props;
    this.toggleSubtopicPanel(topic);
  };

  /**
   * Build DynamicHeaderContainer props from component props.
   *
   * @return  {Object}
   */
  buildHeaderContainerProps = () => {
    const { topic, headerView, toggleSubtopicPanel } = this.props;
    const { addNewTopic } = this;
    return {
      topic,
      headerView,
      addNewTopic,
      toggleSubtopicPanel
    };
  };

  /**
   * Build DynamicTopicContainer props from component props.
   *
   * @return  {Object}
   */
  buildTopicContainerProps = () => {
    const {
      topic,
      topicRequirements,
      topicView,
      subtopics,
      cardsHidden
    } = this.props;

    const showAddTopicInput = this.state.showAddTopicInput;

    return {
      topic,
      topicRequirements,
      topicView,
      cardsHidden,
      topics: subtopics,
      showAddTopicInput
    };
  };

  /**
   * Build DynamicCardContainer props from component props.
   *
   * @return  {Object}
   */
  buildCardsContainerProps = () => {
    const {
      cardRequirements,
      cards,
      subtopics,
      topic,
      cardView,
      cardsHidden,
      cardsSplitScreen,
      updateSelectedCard
    } = this.props;

    return {
      cardRequirements,
      cards,
      subtopics,
      topic,
      cardView,
      cardsHidden,
      cardsSplitScreen,
      updateSelectedCard
    };
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.myTopicsView &&
      prevProps.myTopicsView &&
      (prevProps.myTopicsView.view !== this.props.myTopicsView.view ||
        prevProps.topic !== this.props.topic)
    ) {
      this.openSubTopicPanel();
    }
    const App = document.getElementById('AppRoot');
    if (Object.keys(this.props.active_design).length) {
      const {
        workspace_background_color,
        workspace_font_color
      } = this.props.active_design;
      App.style.color = workspace_font_color;
      App.style.backgroundColor = workspace_background_color;
    } else {
      if (App.style.color) App.style.color = null;
      if (App.style.backgroundColor) App.style.backgroundColor = null;
    }
  }

  openSubTopicPanel = () => {
    if (
      ['TOPIC_TILES', 'TOPIC_HEXES', 'TOPIC_LIST'].includes(
        this.props.myTopicsView.view
      ) &&
      !this.props.myTopicsView.subtopic_panel_visible
    ) {
      // this.handleToggleTopicSection();
    }
  };

  addNewTopic = () => {
    this.setState({ showAddTopicInput: true });
  };

  getBackground = view => {
    if (view) {
      return this.getContentBackground(view);
    }
    const splitLocation = this.props.history.location.pathname.split('/');
    if (splitLocation[1] === 'yays' && splitLocation[2]) {
      return 'view-container-grey';
    }
    return 'view-container-white';
  };

  getContentBackground = view => {
    if (view && GREY_VIEW.includes(view)) {
      return 'view-container-grey';
    } else {
      return 'view-container-white';
    }
  };

  render() {
    const {
      displayRightSubMenuForMenu,
      additionalCssClasses,
      displayTopics,
      subtopics,
      topic,
      displayCards,
      isFileDragged,
      hideRightBar,
      myTopicsView,
      active_design,
      cards
    } = this.props;
    const dynamicHeaderContainerProps = this.buildHeaderContainerProps();
    const dynamicTopicContainerProps = this.buildTopicContainerProps();
    const dynamicCardsContainerProps = this.buildCardsContainerProps();
    return (
      <div
        style={{
          backgroundColor:
            active_design && active_design.card_background_color_display
              ? active_design.card_background_color
              : '',
          backgroundImage:
            active_design && active_design.card_background_image_display
              ? `url("${active_design.card_background_image_url}")`
              : '',
          color: active_design ? active_design.card_font_color : ''
        }}
        className={`view-container ${this.getBackground(
          myTopicsView ? myTopicsView.view : ''
        )}`}
      >
        {/* {active_design && active_design.card_background_image_display ? (
          <div className="view-container-overlay" />
        ) : null} */}
        <DynamicHeaderContainer {...dynamicHeaderContainerProps} />

        <div className={cx('content-container', additionalCssClasses)}>
          <div
            className={cx('content-main', {
              'right-menu-expanded': displayRightSubMenuForMenu
            })}
          >
            {displayTopics && subtopics && (
              <DynamicTopicContainer {...dynamicTopicContainerProps} />
            )}
            <SprintBar cards={cards} topic={topic} />

            {displayCards && (
              <Fragment>
                <DynamicCardContainer {...dynamicCardsContainerProps} />
                {isFileDragged && topic && (
                  <div className="new-card-dropzone-overlay">
                    <AddCardCard
                      view="bottom-dropzone-overlay"
                      topic={topic}
                      bottomOverlay
                    />
                  </div>
                )}
              </Fragment>
            )}
          </div>
        </div>
        {!hideRightBar && (
          <ErrorBoundary>
            <RightActionBarContainer />
          </ErrorBoundary>
        )}
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const { menus, user, page } = sm;
  const uiSettings = user.attributes.ui_settings;
  const cardsSplitScreen = menus.cardsSplitScreen;
  const myTopicsView = uiSettings.my_topics_view.find(
    view => view.id === page.topicId
  );
  const active_design = yayDesign(page.topicId, sm.topics[page.topicId]);
  return {
    page: page.page,
    topicMinimized: !menus.displayHexPanel,
    viewKey: getRelevantViewForPage(state),
    topicPanelView: menus.topicPanelView,
    domainTopicsPanelView: uiSettings.subtopics_panel_view,
    cardsHiddenInWorkspace: uiSettings.cards_hidden_in_workspace,
    displayRightSubMenuForMenu: menus.displayRightSubMenuForMenu,
    isFileDragged: state._newReduxTree.ui.modals.showAddCardBottomOverlay,
    active_design,
    cardsSplitScreen,
    myTopicsView
  };
};

const mapDispatch = {
  toggleSubtopicPanel,
  updateSelectedCard
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(ViewContainer)
);
