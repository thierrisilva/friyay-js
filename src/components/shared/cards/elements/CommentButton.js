import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import { viewCard } from 'Src/newRedux/database/cards/thunks';
import { getCommentsByCardId } from 'Src/newRedux/database/comments/selectors';

const grey = '#d9d9d9';


const CommentButton = ({ card, comments, viewCard }) => {

  return (
    <a className='card-action-button' onClick={ () => viewCard({ cardSlug: card.attributes.slug }) }  >
      <i className="fa fa-comment fa-lg" style={{ color: grey }} />
      <span className="like-button_count-indicator">{ comments ? comments.length : card.attributes.comments_count }</span>
    </a>
  )
}



CommentButton.propTypes = {
  card: object.isRequired,
  viewCard: func.isRequired
};

const mapState = (state, props) => ({
  comments: getCommentsByCardId( state )[ props.card.id ] || null,
})

const mapDispatch = {
  viewCard
};

export default connect(mapState, mapDispatch)(CommentButton);
