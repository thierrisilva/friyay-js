/* global vex */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CommentInput from './comment_input';
import StringHelper from '../../../helpers/string_helper';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import { connect } from 'react-redux';
import { removeComment, editComment as editCommentById } from 'Actions/comments';
import isEqual from 'lodash/isEqual';
import toSafeInteger from 'lodash/toSafeInteger';


import { stateMappings } from 'Src/newRedux/stateMappings';

class CommentsList extends Component {
  static propTypes = {
    comments: PropTypes.array,
    areCommentsLoading: PropTypes.bool,
    editComment: PropTypes.string,
    isSaving: PropTypes.bool,
    edit: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    tip: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
  };

  handleCommentEdit = id => this.props.edit(id);

  handleCommentDelete = id =>
    vex.dialog.confirm({
      message: 'Are you sure you want to delete this comment?',
      callback: value => value && this.props.remove(id, this.props.tip.id)
    });

  render() {
    const {
      props: { comments, areCommentsLoading, editComment, onAvatarClick, tip, userId }
    } = this;

    let commentsContent = null;

    if (areCommentsLoading) {
      commentsContent = <p>Loading comments...</p>;
    } else {
      commentsContent = comments.map(comment => {
        const { user } = comment.attributes;

        let commentActions;

        if (isEqual(toSafeInteger(user.id), toSafeInteger(userId))) {
          commentActions = (
            <span className="comment-actions pull-right">
              <a
                className="text-muted"
                onClick={() => this.handleCommentEdit(comment.id)}
              >
                <i className="glyphicon glyphicon-pencil" />
              </a>

              <a
                className="text-muted"
                onClick={() => this.handleCommentDelete(comment.id)}
              >
                <i className="glyphicon glyphicon-trash" />
              </a>
            </span>
          );
        }

        const id = `comment-${comment.id}`;
        const editId = `edit-${id}`;

        let commentItem = (
          <div className="media" id={id} key={id}>
            <div
              className="media-left"
              style={{ display: 'inline-block', float: 'left' }}
            >
              <UserAvatar
                user={user}
                size={30}
              />
            </div>
            <div className="media-body">
              <p className="media-heading clearfix">
                <Link to={`/users/${user.id}`} >
                  {user.name}
                </Link>
                {commentActions}
              </p>
              <div
                className="comment-text"
                dangerouslySetInnerHTML={{
                  __html: StringHelper.simpleFormat(comment.attributes.body)
                }}
              />
            </div>
          </div>
        );

        if (
          editComment !== null &&
          isEqual(toSafeInteger(editComment), toSafeInteger(comment.id))
        ) {
          commentItem = <CommentInput comment={comment} key={editId} tip={tip} />;
        }

        return commentItem;
      });
    }

    return <div>{commentsContent}</div>;
  }
}

CommentsList.defaultProps = {
  comments: [],
  areCommentsLoading: true,
  editComment: null,
  isSaving: false
};

// const mapState = ({
//   comments: {
//     collection: comments,
//     areCommentsLoading,
//     areUsersLoading,
//     isSaving,
//     users,
//     editComment
//   },
//   appUser: {
//     id
//   }
// }) => ({
//   comments,
//   areCommentsLoading,
//   areUsersLoading,
//   isSaving,
//   users,
//   editComment,
//   userId: id
// });
const mapState = ( state, props ) => {
  const sm = stateMappings( state );
  return {
    comments: state.comments.collection,
    areCommentsLoading: false,
    areUsersLoading: false,
    isSaving: false,
    users: [],
    editComment: null,
    userId: sm.user.id
  }
}

const mapDispatch = {
  remove: removeComment,
  edit: editCommentById
};

export default connect(mapState, mapDispatch)(CommentsList);
