import { getCommentsForCardId } from './thunks';

const dmRequirements = {
  commentsForCard: {
    action: ({ cardId }) => [ getCommentsForCardId, { cardId: cardId }],
    key: ({ cardId }) => `commentsForCard-${cardId}`,
    test: ({ callHistory }) => callHistory && callHistory.lastCall >= moment().unix() - 300
  }
}

export default dmRequirements;
