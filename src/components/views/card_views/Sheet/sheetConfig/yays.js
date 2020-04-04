import React from 'react';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import TopicTitleLink from 'Components/shared/topics/elements/TopicTitleLink';
import IconButton from 'Components/shared/buttons/IconButton';

const Yays = ({ card, topics, setEditCardModalOpen }) => (
  <div className="flex-r-center-center">
    <div>
      {topics.map(topic => (
        <TopicTitleLink key={topic.id} topic={topic} />
      ))}
    </div>
    <IconButton
      additionalClasses="sheet-view__card-title-edit-btn"
      fontAwesome
      icon="pencil"
      onClick={() => setEditCardModalOpen({ cardId: card.id, tab: 'Organize' })}
    />
  </div>
);

const YaysConnected = connect((state, { card }) => {
  const topicIds = card.relationships.topics.data;
  const { topics } = stateMappings(state);

  return {
    topics: filter(topics, topic => topicIds.includes(topic.id))
  };
})(Yays);

export default {
  cssModifier: 'yays',
  display: 'yays',
  resizableProps: {
    minWidth: '180px'
  },
  Component: YaysConnected,
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(cards, card => card.relationships.topics.data.length, order);
  }
};
