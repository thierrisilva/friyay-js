/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { getSortedFilteredCardsByTopic } from 'Src/newRedux/database/cards/selectors';
import { getSortedTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';

const AssigneeList = ({ cards, subtopics, onLoad }) => {
  useEffect(() => {
    if (cards && cards.length) {
      onLoad(cards);
    }
  }, [cards]);
  if (subtopics && subtopics.length) {
    return subtopics.map(s => (
      <ConnectedAssignList key={s.id} topicId={s.id} onLoad={onLoad} />
    ));
  }
  return <Fragment />;
};

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const topic = sm.topics[props.topicId];

  return {
    cards: props.cards
      ? props.cards
      : getSortedFilteredCardsByTopic(state)[props.topicId] || [],
    subtopics: getSortedTopicsByParentTopic(state)[props.topicId] || [],
    topic: topic
  };
};

const ConnectedAssignList = connect(
  mapState,
  null
)(AssigneeList);

export default ConnectedAssignList;
