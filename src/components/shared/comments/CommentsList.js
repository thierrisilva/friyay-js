import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getCommentsByCardId } from 'Src/newRedux/database/comments/selectors';
import { getCommentsForCardId } from 'Src/newRedux/database/comments/thunks';
import CommentItem from './CommentItem';
import CommentBox from './CommentBox';
import DMLoader from 'Src/dataManager/components/DMLoader';

class CommentsList extends Component {
  state = {
    editCommentId: null,
    hideComments: this.props.hideComments
  };

  handleToggleCommentEditMode = commentId => {
    this.setState({ editCommentId: commentId ? commentId : null });
  };

  componentDidUpdate = prevProps => {
    if (prevProps.hideComments !== this.props.hideComments) {
      this.setState({ hideComments: this.props.hideComments });
    }
  };

  render() {
    const {
      cardId,
      comments,
      currentUser,
      wrapperClass,
      dateFormatter
    } = this.props;

    const { editCommentId } = this.state;

    return (
      <div className={classNames('comments-list', wrapperClass)}>
        {!this.state.hideComments && (
          <Fragment>
            {comments.map(comment => (
              <CommentItem
                comment={comment}
                inEditMode={editCommentId == comment.id}
                key={comment.id}
                dateFormatter={dateFormatter}
                isCommentBelongsToCurrentUser={
                  currentUser.id == comment.attributes.user.id
                }
                onToggleEditMode={this.handleToggleCommentEditMode}
              />
            ))}

            <DMLoader
              dataRequirements={{ commentsForCard: { cardId: cardId } }}
              loaderKey="commentsForCard"
            />

            {!editCommentId && <CommentBox cardId={cardId} />}
          </Fragment>
        )}
      </div>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    comments: getCommentsByCardId(state)[props.cardId] || [],
    currentUser: sm.user
  };
};

const mapDispatch = {
  getCommentsForCardId
};

export default connect(
  mapState,
  mapDispatch
)(CommentsList);
