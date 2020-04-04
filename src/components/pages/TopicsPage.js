import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { array } from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { getSortedFilteredTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';
import { getTopicFiltersAsTopicsWithAttributesRequirements } from 'Src/newRedux/filters/selectors';
import ViewContainer from 'Components/views/ViewContainer';

const TopicsPage = ({ allTopics, topicRequirements, topicView }) => (
  <Fragment>
    <Helmet>
      <title>Friyay - yays</title>
    </Helmet>
    <ViewContainer
      displayHeader
      displayTopics={true}
      subtopics={allTopics}
      topicRequirements={topicRequirements}
      headerView="TOPICS"
      topicView={topicView}
      hideRightBar={false}
    />
  </Fragment>
);

TopicsPage.propTypes = {
  allTopics: array.isRequired
};

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const { user } = sm;
  const uiSettings = user.attributes.ui_settings;
  let topicView = '';
  if (typeof topicView === 'object') {
    // it was an object by default, future new created workspace will be HEX by default
    topicView = 'HEX';
  } else {
    topicView =
      uiSettings.all_topics_view === 'SMALL_HEX'
        ? 'HEX'
        : uiSettings.all_topics_view;
  }

  return {
    allTopics: getSortedFilteredTopicsByParentTopic(state)['0'] || [],
    topicRequirements: getTopicFiltersAsTopicsWithAttributesRequirements(state),
    topicView
  };
};

export default connect(mapState)(TopicsPage);
