import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import PropTypes from 'prop-types';
import TextEditor from 'Components/shared/text_editor';
import {
  createCommentForCard,
  updateComment
} from 'Src/newRedux/database/comments/thunks';

class CommentBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commentBody: props.comment ? props.comment.attributes.body : null,
      savingComment: false
    };
  }

  handleCommentChange = commentBody => {
    this.setState({ commentBody });
  };

  handleSubmitComment = async e => {
    e.preventDefault();
    const {
      cardId,
      comment,
      createCommentForCard,
      onCloseCommentBox,
      updateComment
    } = this.props;
    this.setState({ savingComment: true });

    if (comment) {
      const commentUpdate = {
        id: comment.id,
        attributes: {
          body: this.state.commentBody
        }
      };
      await updateComment(commentUpdate);
      onCloseCommentBox();
    } else {
      const newComment = {
        type: 'comments',
        attributes: {
          body: this.state.commentBody
        }
      };
      await createCommentForCard({ newComment, cardId });
    }
    this.setState({ commentBody: '', savingComment: false });
  };

  render() {
    const { comment, onCloseCommentBox, inEditMode } = this.props;
    const { commentBody, savingComment } = this.state;

    return (
      <div className="comment-box">
        <form id="comment-form" onSubmit={this.handleSubmitComment}>
          <TextEditor
            type="comment"
            tabIndex={1}
            placeholder="Type your comment"
            body={commentBody}
            onChange={this.handleCommentChange}
            froalaEditorEvents={
              inEditMode
                ? {}
                : {
                    'froalaEditor.initialized': (e, editor) =>
                      editor.toolbar.hide(),
                    'froalaEditor.focus': (e, editor) => editor.toolbar.show()
                  }
            }
            required
          />

          <div className="comment-box_buttons-container">
            {comment && (
              <a
                className="btn btn-default"
                onClick={() => onCloseCommentBox()}
              >
                Close
              </a>
            )}
            <input
              type="submit"
              value={
                savingComment ? 'Sending...' : comment ? 'Update' : 'Comment'
              }
              className="btn btn-default"
            />
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatch = {
  createCommentForCard,
  updateComment
};

export default connect(
  undefined,
  mapDispatch
)(CommentBox);
