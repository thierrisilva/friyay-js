import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TreeView from 'Components/shared/tree_view';
import { createTopic } from 'Src/newRedux/database/topics/thunks';
import { createCard } from 'Src/newRedux/database/cards/thunks';
import LoadingIndicator from 'Components/shared/LoadingIndicator';

const PurposeDetail = ({
  cardSample,
  selectedView,
  parentTopic,
  createTopic,
  createCard
}) => {
  const [checkedCards, setCheckedCards] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => setCheckedCards([]), [selectedView]);

  const onRowChecked = card => {
    const index = checkedCards.indexOf(card);
    if (index == -1) setCheckedCards(checkedCards.concat(card));
    else {
      setCheckedCards(checkedCards.filter(c => c.id !== card.id));
    }
  };

  const addCard = (card, parentId) => {
    if (card.type === 'topics') {
      const newTopic = {
        attributes: {
          title: card.title,
          parent_id: parentId
        }
      };
      return createTopic(newTopic);
    } else {
      return createCard({
        attributes: { title: card.title },
        relationships: { topics: { data: [parentId] } }
      });
    }
  };

  const handleCardCreation = async () => {
    setIsCreating(true);
    const parentCardMapping = {};
    for (let card of checkedCards) {
      let cardId = parentTopic.id;
      if (card.parent) {
        if (parentCardMapping[card.parent]) {
          cardId = parentCardMapping[card.parent];
        } else {
          const parentCard = cardSample.find(c => c.id == card.parent);
          const result = await addCard(parentCard, parentTopic.id);
          parentCardMapping[parentCard.id] = result.data.data.id;
          cardId = result.data.data.id;
        }
      }
      const result = await addCard(card, cardId);
      parentCardMapping[card.id] = result.data.data.id;
    }
    setIsCreating(false);
  };
  return (
    <div className="view-detail">
      <div className="detail-header">
        <span className="header-text">Card ideas for a {selectedView}</span>
        <button
          className="create-btn"
          onClick={!isCreating && handleCardCreation}
        >
          {isCreating ? (
            <LoadingIndicator className="loading-indicator" />
          ) : (
            'Create Selected Cards'
          )}
        </button>
      </div>
      <div className="header-tip">
        Select in the list below cards you'd like to add to the yay. In the next
        Tab 'Structure' you can further add cards.
      </div>
      <TreeView
        tree={cardSample}
        onRowChecked={onRowChecked}
        parentTopic={parentTopic}
      />
    </div>
  );
};

const mapDispatch = {
  createTopic,
  createCard
};

export default connect(
  () => ({}),
  mapDispatch
)(PurposeDetail);
