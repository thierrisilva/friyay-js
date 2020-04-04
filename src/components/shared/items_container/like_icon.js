import React from 'react';
import PropTypes from 'prop-types';

const LikeIcon = props => {
  return (
    <a href="javascript:void(0)" onClick={props.handleLikeClick} className="btn btn-link btn-sm">
      <i className={props.likeClassName}></i> {props.likesCount}
    </a>
  );
};

LikeIcon.propTypes = {
  handleLikeClick: PropTypes.func,
  likeClassName: PropTypes.string,
  likesCount: PropTypes.string,
};

export default LikeIcon;
