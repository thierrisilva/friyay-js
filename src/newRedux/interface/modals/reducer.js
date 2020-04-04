import actionTypes from './actionEnum';

const defaultState = {
  displayEditDomainModal: null,
  displayEditCardModal: null,
  displayEditUserModal: null,
  displaySelectTopicDestinationModal: {
    isOpen: false,
    mode: null,
    topicId: null
  },
  displayUpdateTopicModal: { isOpen: false, tab: null, topicId: null },
  displayUserInvitationModal: null
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.setEditDomainModalOpen:
      return { ...state, displayEditDomainModal: action.payload };

    case actionTypes.setEditCardModalOpen:
      return { ...state, displayEditCardModal: action.payload };

    case actionTypes.setEditUserModalOpen:
      return { ...state, displayEditUserModal: action.payload };

    case actionTypes.setSelectTopicDestinationModalOpen:
      return { ...state, displaySelectTopicDestinationModal: action.payload };

    case actionTypes.setUpdateTopicModalOpen:
      return { ...state, displayUpdateTopicModal: action.payload };

    case actionTypes.setUserInvitationModalOpen:
      return { ...state, displayUserInvitationModal: action.payload };

    case actionTypes.setShowAddCardBottomOverlay:
      return { ...state, showAddCardBottomOverlay: action.status };

    default:
      return state;
  }
};

export default reducer;
