import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentInput from './comments_box/comment_input';
import CommentsList from './comments_box/comments_list';
import Ability from '../../lib/ability';
import { connect } from 'react-redux';
import { getComments } from 'Actions/comments';

class CommentsBox extends Component {
  static propTypes = {
    getAll: PropTypes.func.isRequired,
    comments: PropTypes.array,
    areCommentsLoading: PropTypes.bool,
    editComment: PropTypes.string,
    tip: PropTypes.object.isRequired,
    view: PropTypes.number,
  };

  static defaultProps = {
    comments: [],
    areCommentsLoading: false,
    editComment: null,
    onAvatarClick: f => f
  };

  componentDidMount() {
    const { props: { comments, getAll, areCommentsLoading, tip } } = this;

    if (comments.filter(comment => comment.attributes.commentable_id === tip.id).length === 0 && !areCommentsLoading) {
      getAll(tip.id);
    }
  }

  componentDidUpdate({ tip: oldTip }) {
    const { props: { tip: newTip, getAll } } = this;

    if (newTip.id !== oldTip.id) {
      getAll(newTip.id);
    }
  }

  render() {
    const {
      props: {
        tip,
        editComment,
        view
      }
    } = this;

    return (
      <div className="comments-box">
        <h4 className="comments-box-title">Comments</h4>
        <CommentsList tip={tip} />

        {Ability.can('comment', 'self', tip) && editComment === null && (
          <CommentInput tip={tip} view={view} />
        )}
      </div>
    );
  }
}

const mapState = ({
  comments: {
    collection: comments,
    areCommentsLoading,
    editComment
  }
}) => ({
  comments,
  areCommentsLoading,
  editComment
});
const mapDispatch = { getAll: getComments };

export default connect(mapState, mapDispatch)(CommentsBox);
