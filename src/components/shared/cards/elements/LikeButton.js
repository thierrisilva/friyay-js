import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool, func, number, object } from 'prop-types';
import Ability from 'Lib/ability';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { toggleLikeCard } from 'Src/newRedux/database/cards/thunks';

const grey = '#d9d9d9';
const orange = '#f2ab13';

const LikeButton = ({ card, likeCount, liked, toggleLikeCard, color }) => {
  const handleClick = e => {
    e.preventDefault();
    toggleLikeCard(card);
  };

  const iconColour = liked ? orange : color ? color : grey;

  return Ability.can('like', 'self', card) ? (
    <a className="card-action-button" onClick={handleClick}>
      <i className="fa fa-heart fa-lg" style={{ color: iconColour }} />
      <span className="like-button_count-indicator">{likeCount}</span>
    </a>
  ) : (
    false
  );
};

LikeButton.propTypes = {
  card: object.isRequired,
  likeCount: number,
  liked: bool,
  toggleLikeCard: func.isRequired
};

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const cardId = props.cardId || props.card.id;
  return {
    likeCount: sm.cards[cardId] ? sm.cards[cardId].attributes.likes_count : 0,
    liked: sm.cards[cardId] && sm.cards[cardId].attributes.liked_by_current_user
  };
};

const mapDispatch = {
  toggleLikeCard
};

export default connect(
  mapState,
  mapDispatch
)(LikeButton);
