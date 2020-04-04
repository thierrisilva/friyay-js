/* global vex */
import moment from 'moment';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import StringHelper from 'Src/helpers/string_helper';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { removeComment } from 'Src/newRedux/database/comments/thunks';
import UserAvatar from 'Src/components/shared/users/elements/UserAvatar';
import IconButton from 'Components/shared/buttons/IconButton';
import CommentBox from './CommentBox';

class CommentItem extends PureComponent {
  static propTypes = {
    isCommentBelongsToCurrentUser: PropTypes.bool
  };

  handleDeleteCommentClick = () => {
    vex.dialog.confirm({
      message: 'Are you sure you want to delete this comment?',
      callback: value => {
        value && this.props.removeComment(this.props.comment.id);
      }
    });
  };

  render() {
    const {
      comment,
      inEditMode,
      dateFormatter,
      onToggleEditMode,
      isCommentBelongsToCurrentUser
    } = this.props;

    return (
      <div
        className={cx('comment-item', {
          'comment-item--in-edit-mode': inEditMode
        })}
      >
        <div className="comment-item_avatar-container">
          <UserAvatar userId={comment.attributes.user.id} />
        </div>
        <div className="comment-item_comment-container">
          {inEditMode ? (
            <CommentBox
              comment={comment}
              onCloseCommentBox={onToggleEditMode}
              inEditMode={inEditMode}
            />
          ) : (
            <Fragment>
              <div className="comment-item_commenter-container">
                <span className="comment-item_commenter">
                  {comment.attributes.user.name}
                  <span className="comment-item_date">
                    {dateFormatter
                      ? dateFormatter(comment)
                      : moment(comment.attributes.created_at).format(
                          'MMMM D, h:mm a'
                        )}
                  </span>
                </span>
                {isCommentBelongsToCurrentUser && (
                  <span className="comment-item_buttons">
                    <IconButton
                      fontAwesome
                      icon="edit"
                      onClick={() => onToggleEditMode(comment.id)}
                    />
                    <IconButton
                      fontAwesome
                      icon="trash"
                      onClick={this.handleDeleteCommentClick}
                    />
                  </span>
                )}
              </div>
              <div
                className="comment-item_comment"
                dangerouslySetInnerHTML={{
                  __html: StringHelper.simpleFormat(comment.attributes.body)
                }}
              />
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatch = {
  removeComment
};

export default connect(
  undefined,
  mapDispatch
)(CommentItem);
