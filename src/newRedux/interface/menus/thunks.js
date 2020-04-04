import { stateMappings } from 'Src/newRedux/stateMappings';
import {
  setLeftMenuOpen,
  setLeftMenuPeoplePanelOpen,
  setWorkspaceListSidebarOpen,
  setUnprioritizedPanel
} from './actions';
import { updateUserUiSettings } from 'Src/newRedux/database/user/thunks';
import { returnToggleValOrBool } from 'Lib/utilities';
import {
  setTopicPanelViewHex,
  setTopicPanelViewList,
  setTopicPanelViewRow,
  setTopicPanelViewSimpleTile,
  setTopicPanelViewTile
} from './actions';

export const toggleLeftMenu = isOpen => async (dispatch, getState) => {
  //not batched as second one is another thunk
  dispatch(setLeftMenuOpen(isOpen));
  dispatch(
    updateUserUiSettings({
      newSettings: { left_menu_open: isOpen }
    })
  );
};

export const toggleLeftMenuPeoplePanel = ({ isOpen }) => async (
  dispatch,
  getState
) => {
  const currentPeoplePanelState = stateMappings(getState()).menus
    .displayLeftMenuPeoplePanel;
  const newState = returnToggleValOrBool(isOpen, currentPeoplePanelState);

  dispatch(setLeftMenuPeoplePanelOpen(newState));
};

/**
 * Set subtopic panel view.
 * @param {String} topicViewMode
 * @return {Void}
 */
export const setTopicPanelView = topicViewMode => {
  return (dispatch, getState) => {
    const sm = stateMappings(getState());
    const page = sm.page;
    const user = sm.user;
    let updatedAttributes;

    const currentSettings = user.attributes.ui_settings.my_topics_view.find(
      item => item.id === page.topicId
    );

    if (typeof currentSettings !== 'undefined') {
      // Update
      const newSettings = {
        id: currentSettings.id,
        view: currentSettings.view,
        cards_hidden: !currentSettings.cards_hidden ? false : true,
        subtopic_view: topicViewMode,
        subtopic_panel_visible: !currentSettings.subtopic_panel_visible
          ? false
          : true
      };
      const userTopicViews = [
        ...user.attributes.ui_settings.my_topics_view.filter(
          view => view.id !== page.topicId
        ),
        newSettings
      ];

      updatedAttributes = { my_topics_view: userTopicViews };
      dispatch(updateUserUiSettings({ newSettings: updatedAttributes }));
    } else {
      // Topics page - view
      updatedAttributes = { all_topics_view: topicViewMode };
      dispatch(updateUserUiSettings({ newSettings: updatedAttributes }));
    }
  };
};

export const toggleUnprioritizedPanel = topicId => (dispatch, getState) => {
  const sm = stateMappings(getState());
  const closed = !sm.menus.unprioritizedPanelClosed[topicId];
  const newSettings = {
    ...sm.menus.unprioritizedPanelClosed,
    [topicId]: closed
  };
  dispatch(setUnprioritizedPanel(newSettings));
  dispatch(
    updateUserUiSettings({
      newSettings: {
        unprioritizedPanelClosed: newSettings
      }
    })
  );
};

/**
 * Toggle workspace sidebar state.
 *
 * @return  {Void}
 */
export const toggleWorkspaceListSidebar = () => {
  return (dispatch, getState) => {
    const isOpen = !stateMappings(getState()).menus.isWorkspaceListSidebarOpen;
    dispatch(setWorkspaceListSidebarOpen(isOpen));
  };
};

/**
 * Set left position for fixed topic header.
 *
 * @return  {String}
 */
export const getLeftPxFixedHeader = () => {
  return (dispatch, getState) => {
    const sm = stateMappings(getState());
    const { menus, user } = sm;
    const leftMenuOpen = user.attributes.ui_settings.left_menu_open;
    const {
      displayLeftSubtopicMenuForTopic,
      isWorkspaceListSidebarOpen
    } = menus;
    let left = 15;

    if (displayLeftSubtopicMenuForTopic.topicId) {
      left += 270;
    }

    if (leftMenuOpen) {
      left += 300;
    }

    if (isWorkspaceListSidebarOpen && leftMenuOpen) {
      left += 300;
    }

    return `${left}px`;
  };
};

/**
 * Subtopics panel view on workspace or home page.
 * @param {String} view
 * @param {Object} domain
 * @return  {Void}
 */
export const setDomainSubtopicsView = (view, domain) => {
  return (dispatch, getState) => {
    const sm = stateMappings(getState());
    dispatch(
      updateUserUiSettings({
        newSettings: {
          subtopics_panel_view: view
        }
      })
    );
  };
};
