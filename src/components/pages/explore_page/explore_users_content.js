import React from 'react';
import { Link } from 'react-router-dom';
import ExplorePageActions from '../../../actions/explore_page_actions';
import AppStore from '../../../stores/app_store';
import ExplorePageStore from '../../../stores/explore_page_store';
import ExploreUserItem from './explore_user_item';
import Masonry from 'react-masonry-component';
import analytics from '../../../lib/analytics';
import createClass from 'create-react-class';

var ExploreUsersContent = createClass({
  getDefaultProps: function() {
    return {
      exploreHeader: 'EXPLORE PEOPLE',
      showNext: false,
      nextURL: '/',
      isModal: true
    };
  },

  getInitialState: function() {
    return {
      users: [],
      usersPagination: null,
      isLoadingUsers: false
    };
  },

  componentDidMount: function() {
    var _this = this;

    if (_this.props.isModal) {
      AppStore.addEventListener(window.MODAL_SCROLL_EVENT, _this.onScrollEnd);
    } else {
      AppStore.addEventListener(window.SCROLL_EVENT, _this.onScrollEnd);
    }

    ExplorePageStore.addEventListener(window.USER_FOLLOW_EVENT, _this.onUserFollow);
    ExplorePageStore.addEventListener(window.USERS_LOAD_EVENT, _this.onUsersLoad);

    this.setState({
      users: [],
      isLoadingUsers: true
    });

    ExplorePageActions.loadUsersByPage(1, null);
  },

  componentWillUnmount: function() {
    var _this = this;

    if (_this.props.isModal) {
      AppStore.removeEventListener(window.MODAL_SCROLL_EVENT, _this.onScrollEnd);
    } else {
      AppStore.removeEventListener(window.SCROLL_EVENT, _this.onScrollEnd);
    }

    ExplorePageStore.removeEventListener(window.USERS_LOAD_EVENT, _this.onUsersLoad);
    ExplorePageStore.removeEventListener(window.USER_FOLLOW_EVENT, _this.onUserFollow);
  },

  onUsersLoad: function() {
    var users           = ExplorePageStore.getUsers();
    var usersPagination = ExplorePageStore.getUsersPagination();
    var showNext        = this.props.showNext;
    var nextURL         = this.props.nextURL;

    this.setState({
      users: users,
      usersPagination: usersPagination,
      isLoadingUsers: false
    });

    if (showNext && users.length === 0) {
      this.props.history.push(nextURL);
    }
  },

  onScrollEnd: function() {
    var isLoadingUsers  = this.state.isLoadingUsers;
    var usersPagination = this.state.usersPagination;

    var currentPage = usersPagination.current_page;
    var totalPages  = usersPagination.total_pages;

    if (currentPage < totalPages && !isLoadingUsers) {
      this.setState({
        isLoadingUsers: true
      });

      ExplorePageActions.loadUsersByPage(currentPage + 1, null);
    }
  },

  onUserFollow: function() {
    this.setState({
      users: [],
      isLoadingUsers: true
    });
    ExplorePageActions.loadUsersByPage(1, null);
  },

  handleFollowClick: function(e) {
    e.preventDefault();
    var $followLink = $(e.target);

    var userID = $followLink[0].dataset.userId;
    ExplorePageActions.followUser(userID);

    analytics.track('Followed User', { id: userID });
  },

  render: function() {
    var users          = this.state.users;
    var isLoadingUsers = this.state.isLoadingUsers;
    var exploreHeader  = this.props.exploreHeader;
    var showNext       = this.props.showNext;
    var nextURL        = this.props.nextURL;

    var nextButton;
    if (showNext) {
      nextButton =
        <span className="pull-right">
          <Link to={nextURL} className="btn btn-default btn-next">&#8594;</Link>
        </span>;
    }

    var loadingIndicator;
    if (isLoadingUsers) {
      loadingIndicator =
        <p className="text-center"><img src="/images/ajax-loader.gif" /></p>;
    }

    if (!isLoadingUsers && users.length === 0) {
      loadingIndicator = 'There are no recommended friends.';
    }

    var usersItems = [];
    if (users.length > 0) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var userItem = <ExploreUserItem user={user} key={'user-item-' + user.id}
                                        handleFollowClick={this.handleFollowClick}
                                        handleUserClick={this.props.handleUserClick} />;
        usersItems.push(userItem);
      }
    }

    return (
      <div className="explore-main-content">
        <h1 className="text-center content-header">
          {exploreHeader}
          {nextButton}
        </h1>

        <Masonry history={this.props.history} location={this.props.location} className="items-container"
                 id="users-container"
                 options={{itemSelector: '.user-item', isFitWidth: true, columnWidth: 300, gutter: 15}}>
          {usersItems}
          <div className="clearfix" />
        </Masonry>
        {loadingIndicator}
      </div>
    );
  }
});

export default ExploreUsersContent;
