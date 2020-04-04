import React from 'react';
import ExploreTopicsContent from './explore_page/explore_topics_content';
import ExploreUsersContent from './explore_page/explore_users_content';
import PageModal from './page_modal';
import analytics from '../../lib/analytics';
import createClass from 'create-react-class';

var ExplorePage = createClass({
  getInitialState: function() {
    return {
      exploringTopics: true,
      exploringUsers: false
    };
  },

  componentDidMount: function() {
    analytics.track('Explore Page Visited');

    if (this.props.requestedPage === 'users') {
      this.setState({
        exploringTopics: false,
        exploringUsers: true
      });
    }
  },

  componentWillUnmount: function() {},

  handleTopicClick: function(e) {
    e.preventDefault();
    var $topicLink = $(e.target);
    var topicSlug = $topicLink[0].dataset.slug;

    if (topicSlug) {
      this.props.router.push('/yays/' + topicSlug);

      var $primaryModal = $('#primary-modal');
      $primaryModal.modal('hide');
    }
  },

  handleUserClick: function(e) {
    e.preventDefault();
    var $userLink = $(e.target);
    var userID = $userLink[0].dataset.userId;

    if (userID) {
      this.props.router.push('/users/' + userID);

      var $primaryModal = $('#primary-modal');
      $primaryModal.modal('hide');
    }
  },

  exploreTopics: function(e) {
    e.preventDefault();

    this.setState({
      exploringTopics: true,
      exploringUsers: false
    });
  },

  exploreUsers: function(e) {
    e.preventDefault();

    this.setState({
      exploringTopics: false,
      exploringUsers: true
    });
  },

  render: function() {
    var exploringTopics = this.state.exploringTopics;
    var exploringUsers = this.state.exploringUsers;

    var exploreContent;
    if (exploringTopics) {
      exploreContent = (
        <ExploreTopicsContent handleTopicClick={this.handleTopicClick} />
      );
    }

    if (exploringUsers) {
      exploreContent = (
        <ExploreUsersContent handleUserClick={this.handleUserClick} />
      );
    }

    return (
      <PageModal size="full-auto">
        <div className="modal-header explore-modal-header">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h1 className="modal-title" id="explore-modal-label">
            <span className="pull-left header-text">Explore</span>

            <small className="pull-left">
              <ul className="nav nav-pills explore-tabs" role="tablist">
                <li
                  role="presentation"
                  className={exploringTopics ? 'active' : null}
                >
                  <a href="javascript:void(0)" onClick={this.exploreTopics}>
                    yays
                  </a>
                </li>
                <li
                  role="presentation"
                  className={exploringUsers ? 'active' : null}
                >
                  <a href="javascript:void(0)" onClick={this.exploreUsers}>
                    People
                  </a>
                </li>
              </ul>
            </small>
          </h1>
        </div>

        <div className="modal-body explore-modal-body">{exploreContent}</div>
      </PageModal>
    );
  }
});

export default ExplorePage;
