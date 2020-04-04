import React, { PureComponent, Suspense } from 'react';
import PropTypes from 'prop-types';
import SplitterLayout from 'react-splitter-layout';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import viewConfig from 'Lib/config/views/views';
import ErrorBoundary from 'Components/shared/errors/ErrorBoundary';
import ViewSelector from 'Src/components/views/card_views/ViewSelector';
import { setDefaultFiltersForView } from 'Src/newRedux/filters/thunks';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import DynamicCardContainerRightPanel from 'Src/components/shared/assemblies/DynamicCardContainerRightPanel';
import { GREY_VIEW } from 'AppConstants';

//To force a view, simply set it as forceViewToDisplay:
const forceViewToDisplay = null; // CardViewConstructionPlayground;

class DynamicCardContainer extends PureComponent {
  // dynamically calculate layout-splitter position to make the split layout resizable.
  // As split layout with position fix breaks resizing this hack is required.
  setSplitterWidth = () => {
    const layoutPane = document.querySelector(
      '.layout-pane:not(.layout-pane-primary)'
    );
    if (layoutPane) {
      const width = layoutPane.style['width'];
      document.querySelector('.layout-splitter').style['right'] = width;
    }
  };
  componentDidMount() {
    const viewKey = this.getViewKey();
    this.props.setDefaultFiltersForView(viewKey);
    this.setSplitterWidth();
  }

  componentDidUpdate(prevProps) {
    const { cardView, setDefaultFiltersForView } = this.props;
    const viewKey = this.getViewKey();
    if (this.props.cardsSplitScreen) {
      this.setSplitterWidth();
    }
    if (cardView !== prevProps.cardView) {
      setDefaultFiltersForView(viewKey);
    }
  }
  state = {
    isLeftPaneOpen: true
  };

  toggleLeftPane = () =>
    this.setState(({ isLeftPaneOpen }) => ({
      isLeftPaneOpen: !isLeftPaneOpen
    }));

  static propTypes = {
    cardView: PropTypes.string,
    cardsHidden: PropTypes.bool
  };

  isTopicView(property) {
    if (
      property === 'TOPIC_HEXES' ||
      property === 'TOPIC_TILES' ||
      property === 'TOPIC_LIST'
    ) {
      return true;
    }

    return false;
  }

  getViewKey = () => {
    const { topic } = this.props;
    const user_preference = this.props.cardView;
    let topic_default = topic ? topic.attributes.default_view_id : null;

    if (user_preference) {
      return user_preference;
    } else if (topic_default) {
      return topic_default;
    }
  };

  render() {
    const { isLeftPaneOpen } = this.state;
    const { cardsHidden, cardsSplitScreen, myTopicsView } = this.props;
    let viewKey = this.getViewKey();
    const cardsHiddenForUser =
      typeof cardsHidden !== 'undefined'
        ? cardsHidden
        : this.isTopicView(viewKey);

    if (this.isTopicView(viewKey) && !cardsHiddenForUser) {
      viewKey = 'GRID';
    }

    const CardViewComponent =
      forceViewToDisplay || (viewKey && viewConfig.cards[viewKey])
        ? viewConfig.cards[viewKey].viewComponent
        : ViewSelector;

    let splitLayoutProps = {
      secondaryInitialSize: 30
    };

    const isSplitLayoutDisabled = viewConfig.cards[viewKey]
      ? viewConfig.cards[viewKey].isSplitLayoutDisabled
      : false;

    if (viewConfig.cards[viewKey] && viewConfig.cards[viewKey].layoutConfig) {
      splitLayoutProps = viewConfig.cards[viewKey].layoutConfig;
    }

    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingIndicator />}>
          <div className="cards-container">
            {cardsHiddenForUser ? (
              <div className="placeholder-view" />
            ) : isSplitLayoutDisabled ? (
              <div className="splitter-layout splitter-layout-custom">
                <CardViewComponent {...this.props} />
              </div>
            ) : (
              <SplitterLayout
                key={viewKey}
                customClassName="splitter-layout-custom"
                primaryMinSize={25}
                secondaryMinSize={30}
                onDragEnd={() => {
                  this.setSplitterWidth();
                }}
                percentage
                {...splitLayoutProps}
              >
                {isLeftPaneOpen && <CardViewComponent {...this.props} />}
                {!!cardsSplitScreen && (
                  <DynamicCardContainerRightPanel
                    isLeftPaneOpen={isLeftPaneOpen}
                    toggleLeftPane={this.toggleLeftPane}
                  />
                )}
              </SplitterLayout>
            )}
          </div>
        </Suspense>
      </ErrorBoundary>
    );
  }
}

const mapDispatch = {
  setDefaultFiltersForView
};

const mapState = state => {
  const { menus, user, page } = stateMappings(state);
  const uiSettings = user.attributes.ui_settings;
  const cardsSplitScreen = menus.cardsSplitScreen;
  const myTopicsView = uiSettings.my_topics_view.find(
    view => view.id === page.topicId
  );

  return {
    cardsSplitScreen,
    myTopicsView
  };
};

export default connect(
  mapState,
  mapDispatch
)(DynamicCardContainer);
