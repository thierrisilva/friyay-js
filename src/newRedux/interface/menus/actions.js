import actionTypes from './actionEnum';

export const setLeftMenuOpen = isOpen => ({
  type: actionTypes.setLeftMenuOpen,
  payload: isOpen
});

export const setLeftMenuPeoplePanelOpen = isOpen => ({
  type: actionTypes.setLeftMenuPeoplePanelOpen,
  payload: isOpen
});

export const setLeftSubtopicMenuOpenForTopic = (
  topicIdOrNull,
  openQuickAddForm = false
) => ({
  type: actionTypes.setLeftSubtopicMenuOpenForTopic,
  payload: { topicId: topicIdOrNull, openQuickAddForm }
});

export const setRightMenuOpenForMenu = menuOrNull => ({
  type: actionTypes.setRightMenuOpenForMenu,
  payload: menuOrNull
});

export const toggleCardsSplitScreen = menuOrNull => ({
  type: actionTypes.toggleCardsSplitScreen
});

export const setRightPanelOpen = isOpen => ({
  type: actionTypes.setRightPanelOpen,
  payload: isOpen
});

export const toggleHexPanel = () => ({
  type: actionTypes.setHexPanelOpen
});

export const setUnprioritizedPanel = settings => ({
  type: actionTypes.toggleUnprioritizedPanel,
  payload: settings
});

export const setTopicPanelViewHex = () => ({
  type: actionTypes.setTopicPanelViewHex
});

export const setTopicPanelViewRow = () => ({
  type: actionTypes.setTopicPanelViewRow
});

export const setTopicPanelViewList = () => ({
  type: actionTypes.setTopicPanelViewList
});

export const setTopicPanelViewTile = () => ({
  type: actionTypes.setTopicPanelViewTile
});

export const setTopicPanelViewSimpleTile = () => ({
  type: actionTypes.setTopicPanelViewSimpleTile
});

export const setWorkspaceListSidebarOpen = isOpen => ({
  type: actionTypes.setWorkspaceListSidebarOpen,
  payload: isOpen
});
