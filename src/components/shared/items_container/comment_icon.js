import React from 'react';

const CommentIcon = props => {
  return (
    <a href="javascript:void(0)" onClick={props.handleCommentClick} className="btn btn-link btn-sm">
      <i className={props.commentClassName}></i> {props.commentsCount}
    </a>
  )
}

export default CommentIcon;