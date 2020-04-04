import AppDispatcher from '../dispatchers/app_dispatcher';

var UsersPageActions = {
  loadUsersByPage: function(groupID, pageNumber, pageSize, filterType) {
    if (!pageNumber) {
      pageNumber = 1;
    }

    if (!pageSize) {
      pageSize = 36;
    }

    AppDispatcher.dispatch({
      actionType: 'LOAD_PEOPLE_ITEMS_BY_PAGE',
      groupID,
      pageNumber,
      pageSize,
      filterType
    });
  },

  followUser: function(userID) {
    AppDispatcher.dispatch({
      actionType: 'FOLLOW_USER',
      userID
    });
  },

  unfollowUser: function(userID) {
    AppDispatcher.dispatch({
      actionType: 'UNFOLLOW_USER',
      userID
    });
  }
};

export default UsersPageActions;
