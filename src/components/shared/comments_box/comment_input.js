import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextEditor from 'Components/shared/text_editor';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import { connect } from 'react-redux';
import { resetComment, saveComment, updateComment } from 'Actions/comments';
import { VIEWS_ENUM } from 'Enums';
import isEqual from 'lodash/isEqual';


import { stateMappings } from 'Src/newRedux/stateMappings';

class CommentInput extends Component {
  static propTypes = {
    comment: PropTypes.object,
    isSaving: PropTypes.bool,
    update: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    tip: PropTypes.object.isRequired,
    userName: PropTypes.string.isRequired,
    userAvatar: PropTypes.string,
    userId: PropTypes.string.isRequired,
    view: PropTypes.number,
  };

  static defaultProps = {
    comment: null,
    users: [],
    isSaving: false
  };

  state = {
    body: '',
    isStartCommenting : false
  };

  componentDidMount() {
    if (this.props.comment !== null) {
      this.setState(state => ({
        ...state,
        body: this.props.comment.attributes.body
      }));
    }
  }

  componentWillReceiveProps = ({ tip }) => {
    const { props: { tip: oldTip } } = this;
    if(!isEqual(tip, oldTip))
    {
      this.setState(state => ({ ...state, isStartCommenting: false}));
    }
  };

  handleInputChange = body => this.setState(state => ({ ...state, body }));

  handleEditClose = () => this.props.reset();

  handleCommentSubmit = async e => {
    e.preventDefault();

    const { props: { tip, comment, save, update, reset }, state: { body } } = this;

    if (comment !== null) {
      await update({ id: comment.id, body });
      this.setState(state => ({ ...state, body: ''}));
      reset();
    } else {
      await save({ id: tip.id, body });
      this.setState(state => ({ ...state, body: ''}));
    }
    this.toggleCommentEdit();
  };

  toggleCommentEdit = () =>
  {
    this.setState(state => ({ ...state, isStartCommenting: !this.state.isStartCommenting}));
  }

  render() {
    const { props: { comment, isSaving, user, view }, state: { body, isStartCommenting  } } = this;
    return (
      <div className="flex-r-start">
        <div className="mr10">
          <UserAvatar user={ user } size={30} readonly />
        </div>


        <div className="flex-1 alt">
         {(view != VIEWS_ENUM.WIKI || isStartCommenting === true) && (

          <form id="comment-form" onSubmit={this.handleCommentSubmit}>
            <TextEditor
              type="comment"
              tabIndex={1}
              placeholder="Type your comment"
              body={body}
              onChange={this.handleInputChange}
              required
            />

            <div className="comment-form-actions pull-right">
              {comment !== null && (
                <a
                  className="btn btn-default btn-sm"
                  onClick={this.handleEditClose}
                >
                  Close
                </a>
              )}
              <input
                type="submit"
                value={
                  isSaving
                    ? 'Sending...'
                    : comment !== null ? 'Update' : 'Comment'
                }
                className="btn btn-default"
              />
            </div>
          </form>
         )}

        {view === VIEWS_ENUM.WIKI && isStartCommenting === false && (
          <input type="text" className="form-control commentInput" placeholder="Type your comment"
          onClick={() => this.toggleCommentEdit()}/>
        )}
        </div>
      </div>
    );
  }
}


const mapState = ( state, props ) => {
  const sm = stateMappings( state );
  return {
    isSaving: false,
    user: sm.user
  }
}

const mapDispatch = {
  update: updateComment,
  save: saveComment,
  reset: resetComment
};

export default connect(mapState, mapDispatch)(CommentInput);
