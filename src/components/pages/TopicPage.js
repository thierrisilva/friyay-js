import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { buildCardRequirements } from 'Lib/utilities';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { getSortedFilteredCardsByTopic } from 'Src/newRedux/database/cards/selectors';
import { getSortedTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';
import ViewContainer from 'Components/views/ViewContainer';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import withDataManager from 'Src/dataManager/components/withDataManager';

const TopicPage = ({
  cardRequirements,
  thisTopicsCards,
  thisTopicsSubtopics,
  topic,
  isDeletingTopic,
  displayTopics,
  cardView,
  topicView,
  cardsHidden
}) => (
  <Fragment>
    {topic && (
      <Helmet>
        <title>{topic.attributes.title}</title>
      </Helmet>
    )}
    {isDeletingTopic ? (
      <LoadingIndicator />
    ) : (
      <ViewContainer
        cards={thisTopicsCards || []}
        cardRequirements={cardRequirements}
        displayCards
        displayHeader
        displayTopics={displayTopics}
        headerView="TOPIC"
        subtopics={thisTopicsSubtopics}
        topic={topic}
        cardView={cardView}
        topicView={topicView}
        cardsHidden={cardsHidden}
      />
    )}
  </Fragment>
);

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const { user, page, loadIndicator } = sm;
  const topicId = page.topicId;
  const cardRequirements = buildCardRequirements({ topicId: topicId }, state);
  const uiSettings = user.attributes.ui_settings;
  const myTopicsView = uiSettings.my_topics_view.find(
    view => view.id === sm.page.topicId
  );
  const cards = getSortedFilteredCardsByTopic(state)[topicId];
  return {
    cardRequirements: cardRequirements,
    thisTopicsCards: cards,
    thisTopicsSubtopics: getSortedTopicsByParentTopic(state)[topicId] || [],
    topic: sm.topics[page.topicId],
    topicId: topicId,
    topicSlug: page.topicSlug,
    isDeletingTopic: loadIndicator.deletingTopic === page.topicId,
    displayTopics: !!(myTopicsView && myTopicsView.subtopic_panel_visible),
    cardView: myTopicsView && myTopicsView.view,
    topicView: (myTopicsView && myTopicsView.subtopic_view) || 'TILE',
    cardsHidden: myTopicsView && myTopicsView.cards_hidden
  };
};

const dataRequirements = props => {
  return {
    subtopicsForTopic: { topicId: props.topicId },
    topicWithSlug: { topicSlug: props.topicSlug }
  };
};

export default withDataManager(dataRequirements, mapState)(TopicPage);
