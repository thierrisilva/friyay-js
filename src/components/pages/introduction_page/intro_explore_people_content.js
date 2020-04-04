import React from 'react';
import createClass from 'create-react-class';
import ExploreUsersContent from '../explore_page/explore_users_content';

var IntroExplorePeopleContent = createClass({
  handleUserClick: function(e) {
    e.preventDefault();
  },

  render: function() {
    var exploreHeader = 'Who would you like to follow?';

    return (
      <div className="intro-explore-people">
        <ExploreUsersContent exploreHeader={exploreHeader} handleTopicClick={this.handleUserClick}
                             showNext={true} nextURL="/" history={this.props.history} isModal={false} />
      </div>
    );
  }
});

export default IntroExplorePeopleContent;
