/* global window, Messenger */
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bool, func, string } from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { getGroupFollows } from 'Src/newRedux/database/groups/thunks';
import { idFromSlug } from 'Lib/utilities';
import { setLaunchComplete } from 'Src/newRedux/session/actions';
import { setRouterHistory } from 'Src/newRedux/routing/actions';
import { setupDataManager } from 'Src/dataManager/DataManager';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { TipHiveVersionManager } from 'Lib/version';
import { toggleUtilityValue } from 'Src/newRedux/utilities/actions';

import Auth from 'Lib/auth';
import tiphive from 'Lib/tiphive';

import BottomCardDock from 'Components/navigation/BottomCardDock';
import CardsPage from './pages/CardsPage';
import CustomDragLayer from 'Src/components/shared/drag_and_drop/CustomDragLayer';
import DomainUpdateFormPage from 'Components/pages/domain_update_form_page';
import ErrorBoundary from 'Components/shared/errors/ErrorBoundary';
import ItemPage from 'Components/pages/ItemPage';
import LeftMenu from 'Components/menus/left/LeftMenu';
import LeftSubtopicMenu from 'Components/menus/left/LeftSubtopicMenu';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import MainFormPage from 'Components/pages/MainFormPage';
import PeoplePage from './pages/PeoplePage';
import TopicsPage from './pages/TopicsPage';
import TopicPage from './pages/TopicPage';
import TopicSelectDestinationPage from 'Components/pages/TopicSelectDestinationPage';
import TopicUpdateFormPage from 'Components/pages/topic_update_form_page';
import TopSearchBar from 'Components/navigation/top_search_bar/TopSearchBar';
import UserPage from './pages/UserPage';
import UserUpdateFormPage from 'Components/pages/user_update_form_page';
import UsersInvitationPage from 'Components/pages/users_invitation_page';
import { yayDesign } from 'Src/lib/utilities';

class App extends Component {
  static propTypes = {
    getGroupFollows: func.isRequired,
    launching: bool,
    page: string,
    setLaunchComplete: func.isRequired,
    setRouterHistory: func.isRequired,
    setupDataManager: func.isRequired,
    toggleUtilityValue: func.isRequired
  };

  mounted_ = false;

  componentWillMount() {
    this.dataManager = this.props.setupDataManager();
  }

  async componentDidMount() {
    this.mounted_ = true;
    const {
      getGroupFollows,
      history,
      match,
      match: { url },
      setRouterHistory,
      setLaunchComplete
    } = this.props;

    const destination = await Auth.validateToken(url); //will be '/login' if not authenticated, but may be the path they were headed to before being redirected to login
    if (destination != url) {
      history.push(destination);
    }
    if (destination != '/login') {
      setRouterHistory(history);
      const versionManager = new TipHiveVersionManager(Messenger);
      window.addEventListener('keydown', this.handleKeyDown, true);
      window.addEventListener('keyup', this.handleKeyUp, true);
      await this.dataManager.getLaunchData();
      this.mounted_ && setLaunchComplete(true);
      match.params.groupSlug &&
        getGroupFollows(idFromSlug(match.params.groupSlug));
      tiphive.detectDropboxCallback();
    }
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.dataManager.updateReduxOnPageChange(this.props);
    });
  }

  componentWillUnmount() {
    this.mounted_ = false;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown = e => {
    if (e.ctrlKey || e.keyCode == 17) {
      this.props.toggleUtilityValue({ ctrlKeyDown: true });
    }
  };

  handleKeyUp = e => {
    if (e.ctrlKey || e.keyCode == 17) {
      this.props.toggleUtilityValue({ ctrlKeyDown: false });
    }
  };

  //for joyride.  TODO: MH: move joyride out of context and into redux or alternative
  handleShowTour = () => {
    this.joyride.reset(true);
  };

  renderPage = page => {
    switch (page) {
      case 'home':
        return <CardsPage />;
      case 'user':
        return <UserPage />;
      case 'users':
        return <PeoplePage />;
      case 'topic':
        return <TopicPage />;
      case 'topics':
        return <TopicsPage />;
      default:
        return false;
    }
  };

  render() {
    const {
      displayEditDomainModal,
      displayEditCardModal,
      displayEditUserModal,
      displaySelectTopicDestinationModal,
      displayUpdateTopicModal,
      displayUserInvitationModal,
      launching,
      page
    } = this.props;

    return launching ? (
      <LoadingIndicator />
    ) : (
      <ErrorBoundary>
        <div id="AppRoot" className="tiphive-window">
          <LeftMenu handleShowTour={this.handleShowTour} />
          <div className="tiphive-outer-container">
            <ErrorBoundary>
              <TopSearchBar />
            </ErrorBoundary>
            <div className="tiphive-inner-container">
              <ErrorBoundary>
                <LeftSubtopicMenu />
              </ErrorBoundary>
              <div className="tiphive-content">
                {this.renderPage(page)}
                <BottomCardDock />
              </div>
            </div>
          </div>

          <Route path="*/cards/:cardSlug" component={ItemPage} />
          <Route path="*/tips/:cardSlug" component={ItemPage} />

          {displayEditDomainModal && <DomainUpdateFormPage />}
          {displayEditCardModal && <MainFormPage cardFormOnly />}
          {displayEditUserModal && <UserUpdateFormPage />}
          {displaySelectTopicDestinationModal.isOpen && (
            <TopicSelectDestinationPage />
          )}
          {displayUpdateTopicModal.isOpen && <TopicUpdateFormPage />}
          {displayUserInvitationModal && <UsersInvitationPage />}
          <CustomDragLayer />
        </div>
      </ErrorBoundary>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const { modals, session } = sm;

  return {
    displayEditDomainModal: modals.displayEditDomainModal,
    displayEditCardModal: modals.displayEditCardModal,
    displayEditUserModal: modals.displayEditUserModal,
    displaySelectTopicDestinationModal:
      modals.displaySelectTopicDestinationModal,
    displayUpdateTopicModal: modals.displayUpdateTopicModal,
    displayUserInvitationModal: modals.displayUserInvitationModal,
    launching: !session.launchComplete
  };
};

const mapDispatch = {
  getGroupFollows,
  setLaunchComplete,
  setRouterHistory,
  setupDataManager,
  toggleUtilityValue
};

export default DragDropContext(HTML5Backend)(
  connect(
    mapState,
    mapDispatch
  )(App)
);
