import actionTypes from './actionEnum';

const defaultState = {
  displayHexPanel: false,
  displayLeftMenu: true,
  displayLeftMenuPeoplePanel: false,
  displayLeftSubtopicMenuForTopic: {
    topicId: null,
    openQuickAddForm: false
  },
  displayRightSubMenuForMenu: null,
  displayRightPanel: false,
  unprioritizedPanelClosed: {},
  topicPanelView: 'HEX', // hex, row, list, tile, simple_tile
  isWorkspaceListSidebarOpen: false,
  cardsSplitScreen: false
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.setHexPanelOpen:
      return { ...state, displayHexPanel: !state.displayHexPanel };

    case actionTypes.setLeftMenuOpen:
      return { ...state, displayLeftMenu: action.payload };

    case actionTypes.setLeftMenuPeoplePanelOpen:
      return { ...state, displayLeftMenuPeoplePanel: action.payload };

    case actionTypes.setLeftSubtopicMenuOpenForTopic:
      return { ...state, displayLeftSubtopicMenuForTopic: action.payload };

    case actionTypes.setRightMenuOpenForMenu:
      return { ...state, displayRightSubMenuForMenu: action.payload };

    case actionTypes.setRightPanelOpen:
      return { ...state, displayRightPanel: action.payload };

    case actionTypes.toggleUnprioritizedPanel:
      return {
        ...state,
        unprioritizedPanelClosed: action.payload || {}
      };
    case actionTypes.setTopicPanelViewHex:
      return { ...state, topicPanelView: 'HEX' };

    case actionTypes.setTopicPanelViewRow:
      return { ...state, topicPanelView: 'ROW' };

    case actionTypes.setTopicPanelViewList:
      return { ...state, topicPanelView: 'LIST' };

    case actionTypes.setTopicPanelViewTile:
      return { ...state, topicPanelView: 'TILE' };

    case actionTypes.setTopicPanelViewSimpleTile:
      return { ...state, topicPanelView: 'SIMPLE_TILE' };

    case actionTypes.setWorkspaceListSidebarOpen:
      return { ...state, isWorkspaceListSidebarOpen: action.payload };

    case actionTypes.toggleCardsSplitScreen:
      return { ...state, cardsSplitScreen: !state.cardsSplitScreen };

    default:
      return state;
  }
};

export default reducer;
