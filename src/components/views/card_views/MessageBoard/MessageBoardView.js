import React from 'react';
import PropTypes from 'prop-types';
import DMLoader from 'Src/dataManager/components/DMLoader';
import MessageBoardCard from './MessageBoardCard';
import ActiveFiltersPanel from 'Components/shared/filters/ActiveFiltersPanel';

class MessageBoard extends React.PureComponent {
  static propTypes = {
    cards: PropTypes.array,
    topic: PropTypes.object,
    cardRequirements: PropTypes.object
  };

  render() {
    const { cards, cardRequirements } = this.props;

    const sortedCards = cards.sort(
      (a, b) =>
        moment(b.attributes.created_at).unix() -
        moment(a.attributes.created_at).unix()
    );

    return (
      <div className="p-x-30px p-b-1 message-board-view">
        <ActiveFiltersPanel />
        <div className="m-t-20px">
          {sortedCards.map(card => (
            <MessageBoardCard key={card.id} card={card} />
          ))}
        </div>
        <DMLoader
          dataRequirements={{
            cardsWithAttributes: { attributes: cardRequirements }
          }}
          loaderKey="cardsWithAttributes"
        />
      </div>
    );
  }
}

export default MessageBoard;
