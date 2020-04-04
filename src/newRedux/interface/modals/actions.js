import actionTypes from './actionEnum';

export const setEditDomainModalOpen = ( bool ) => ({
  type: actionTypes.setEditDomainModalOpen,
  payload: bool
});

//pass an object of card ID and tab to open on
export const setEditCardModalOpen = ( objectOrNull ) => ({
  type: actionTypes.setEditCardModalOpen,
  payload: objectOrNull
});


export const setEditUserModalOpen = ( bool ) => ({
  type: actionTypes.setEditUserModalOpen,
  payload: bool
});

export const setSelectTopicDestinationModalOpen = (topicId, isOpen, mode) => ({
  type: actionTypes.setSelectTopicDestinationModalOpen,
  payload: { isOpen, mode, topicId }
});

export const setUpdateTopicModalOpen = (topicId, isOpen, tab = 0) => ({
  type: actionTypes.setUpdateTopicModalOpen,
  payload: { isOpen, tab, topicId }
});

export const setUserInvitationModalOpen = ( userIdOrNull ) => ({
  type: actionTypes.setUserInvitationModalOpen,
  payload: userIdOrNull
});

export const setShowAddCardBottomOverlay = (status) => ({
  type: actionTypes.setShowAddCardBottomOverlay,
  status
});
