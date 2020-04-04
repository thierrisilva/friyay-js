import React from 'react';
import PropTypes from 'prop-types';

import CommentButton from 'Components/shared/cards/elements/CommentButton';
import LikeButton from 'Components/shared/cards/elements/LikeButton';
import StarButton from 'Components/shared/cards/elements/StarButton';

const CardActions = ( {card, className} ) =>  (
  <div className={className || 'card-actions-container'}>
    <CommentButton card={card} />
    <LikeButton card={card} />
    <StarButton card={card} />
  </div>

);

CardActions.propTypes = {
  card: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default CardActions;
