import React from 'react';
import createClass from 'create-react-class';
import ExploreTopicsContent from '../explore_page/explore_topics_content';

var IntroExploreTopicsContent = createClass({
  render: function() {
    var exploreHeader = 'Which yays would you like to create or follow?';

    return (
      <div className="intro-explore-topics">
        <ExploreTopicsContent
          exploreHeader={exploreHeader}
          handleTopicFormSubmit={this.handleTopicFormSubmit}
          showNext={true}
          nextURL="/introduction/invite_friends"
          showInput={true}
          isModal={false}
        />
      </div>
    );
  }
});

export default IntroExploreTopicsContent;
