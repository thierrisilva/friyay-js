import AppDispatcher from '../dispatchers/app_dispatcher';

var UserPageActions = {
  loadUser: function(userID) {
    AppDispatcher.dispatch({
      actionType: 'LOAD_USER',
      userID: userID
    });
  },

  loadUserItemsByPage: function(groupID, userID, itemType, pageNumber, pageSize, filterType, labelIDs) {
    if (!pageNumber) {
      pageNumber = 1;
    }

    if (!pageSize) {
      pageSize = window.ITEMS_PER_PAGE;
    }

    AppDispatcher.dispatch({
      actionType: 'LOAD_USER_ITEMS_BY_PAGE',
      groupID: groupID,
      userID: userID,
      itemType: itemType,
      pageNumber: parseInt(pageNumber),
      pageSize: parseInt(pageSize),
      filterType,
      labelIDs
    });
  },

  followUser: function(userID) {
    AppDispatcher.dispatch({
      actionType: 'FOLLOW_USER',
      userID: userID
    });
  },

  unfollowUser: function(userID) {
    AppDispatcher.dispatch({
      actionType: 'UNFOLLOW_USER',
      userID: userID
    });
  },

  updateUser: function(userID, userFirstName, userLastName, userEmail, userUsername, userPassword,
                       userPasswordConfirmation, userCurrentPassword) {
    AppDispatcher.dispatch({
      actionType: 'UPDATE_USER',
      userID: userID,
      userFirstName: userFirstName,
      userLastName: userLastName,
      userEmail: userEmail,
      userUsername: userUsername,
      userPassword: userPassword,
      userPasswordConfirmation: userPasswordConfirmation,
      userCurrentPassword: userCurrentPassword
    });
  },

  removeUserItem: itemId =>
    AppDispatcher.dispatch({
      actionType: 'REMOVE_USER_ITEM',
      itemId
    }),
};

export default UserPageActions;
