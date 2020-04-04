import { stateMappings } from 'Src/newRedux/stateMappings';
import { updateUserUiSettings } from 'Src/newRedux/database/user/thunks';
import { toggleHexPanel } from 'Src/newRedux/interface/menus/actions';
import { updateDesign } from 'Src/newRedux/interface/views/actions';

import analytics from 'Lib/analytics';

/**
 * Get topic view name when selecting topic view on the right menu.
 *
 * @param {String}  topicLabel
 * @return  {String}
 */
export const getTopicViewName = topicLabel => {
  return () => {
    switch (topicLabel) {
      case 'TOPIC_HEXES':
        return 'SMALL_HEX';
      case 'TOPIC_LIST':
        return 'LIST';
      case 'TOPIC_TILES':
        return 'TILE';
      default:
        return 'HEX';
    }
  };
};

export const selectView = viewObject => async (dispatch, getState) => {
  const sm = stateMappings(getState());
  const { menus, page, user } = sm;
  let update = null;
  let newSettings = {};
  let subtopicView = 'HEX';
  let userTopicViews = [];

  analytics.track('View Selected', { View: viewObject.key });

  switch (page.page) {
    case 'topic':
      // Find the current topic settings view
      const currentSettings = user.attributes.ui_settings.my_topics_view.find(
        item => item.id === page.topicId
      );
      if (
        viewObject.key === 'TOPIC_HEXES' ||
        viewObject.key === 'TOPIC_LIST' ||
        viewObject.key === 'TOPIC_TILES'
      ) {
        subtopicView = dispatch(getTopicViewName(viewObject.key));

        newSettings = {
          id: page.topicId,
          view: viewObject.key,
          cards_hidden: true,
          subtopic_view: subtopicView,
          subtopic_panel_visible: true
        };
      } else {
        newSettings = {
          id: page.topicId,
          view: viewObject.key,
          cards_hidden: false,
          subtopic_view:
            (currentSettings && currentSettings.subtopic_view) || 'TILE',
          subtopic_panel_visible:
            !!currentSettings && currentSettings.subtopic_panel_visible
        };
      }

      userTopicViews = [
        ...user.attributes.ui_settings.my_topics_view.filter(
          view => view.id !== page.topicId
        ),
        newSettings
      ];

      update = { my_topics_view: userTopicViews };

      break;
    case 'topics':
      update = { all_topics_view: viewObject.defaultConfig.topic };
      break;
    default:
      if (
        viewObject.key === 'TOPIC_HEXES' ||
        viewObject.key === 'TOPIC_LIST' ||
        viewObject.key === 'TOPIC_TILES'
      ) {
        update = {
          cards_hidden_in_workspace: true,
          subtopics_panel_view: dispatch(getTopicViewName(viewObject.key)),
          tips_view: viewObject.key
        };

        if (!menus.displayHexPanel) {
          dispatch(toggleHexPanel());
        }
      } else {
        update = {
          tips_view: viewObject.defaultConfig.card,
          cards_hidden_in_workspace: false
        };
      }
      break;
  }

  dispatch(updateUserUiSettings({ newSettings: update }));
};

/**
 * Toggle topic's subtopic panel.
 *
 * @param {Object} topic
 * @return  {Void}
 */
export const toggleSprintBar = topic => {
  if (!topic) {
    return;
  }
  return (dispatch, getState) => {
    const sm = stateMappings(getState());
    const { user } = sm;
    const { my_topics_view } = user.attributes.ui_settings;
    const currentSettings = my_topics_view.find(
      item => item.id === topic.id
    ) || { id: topic.id };
    // TODO: The ui settings object change/update are scattered in several place, need to unify them to prevent undesired object mutation.
    const updatedSettings = Object.assign({}, currentSettings, {
      sprintbar_panel_visible: !(
        !!currentSettings && currentSettings.sprintbar_panel_visible
      )
    });

    const myTopicsViewNew = [
      ...user.attributes.ui_settings.my_topics_view.filter(
        view => view.id !== topic.id
      ),
      updatedSettings
    ];

    dispatch(
      updateUserUiSettings({
        newSettings: {
          my_topics_view: myTopicsViewNew
        }
      })
    );
  };
};

/**
 * Toggle topic's subtopic panel.
 *
 * @param {Object} topic
 * @return  {Void}
 */
export const toggleSubtopicPanel = topic => {
  if (!topic) {
    return toggleWorkspaceTopicsPanel();
  }
  return (dispatch, getState) => {
    const sm = stateMappings(getState());
    const { user } = sm;
    const { my_topics_view } = user.attributes.ui_settings;
    const currentSettings = my_topics_view.find(
      item => item.id === topic.id
    ) || { id: topic.id };
    // TODO: The ui settings object change/update are scattered in several place, need to unify them to prevent undesired object mutation.
    const updatedSettings = Object.assign({}, currentSettings, {
      subtopic_panel_visible: !(
        !!currentSettings && currentSettings.subtopic_panel_visible
      )
    });

    const myTopicsViewNew = [
      ...user.attributes.ui_settings.my_topics_view.filter(
        view => view.id !== topic.id
      ),
      updatedSettings
    ];

    dispatch(
      updateUserUiSettings({
        newSettings: {
          my_topics_view: myTopicsViewNew
        }
      })
    );
  };
};

/**
 * Toggle topics panel visibility.
 *
 * @param {Object} domain
 * @return  {Void}
 */
export const toggleWorkspaceTopicsPanel = () => {
  return (dispatch, getState) => {
    const sm = stateMappings(getState());
    const { user } = sm;
    const uiSettings = user.attributes.ui_settings;

    const newSettings = Object.assign({}, uiSettings, {
      topics_panel_visible: !!!uiSettings.topics_panel_visible
    });

    dispatch(updateUserUiSettings({ newSettings }));
  };
};

/**
 * Set the design
 *
 * @param {object} design
 * @return  {Void}
 */
export const setDesign = design => async (dispatch, getState) => {
  dispatch(updateDesign(design));
};
