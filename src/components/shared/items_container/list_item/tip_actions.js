import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ability from '../../../../lib/ability';
import TipActionListDropdown from './tip_action_list_dropdown';

const grey = '#d9d9d9';
const orange = '#f2ab13';
const red = orange; // for now :( '#f44336';

class TipActions extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    handleItemClick: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    archiveItem: PropTypes.func.isRequired,
    onLikeUnlikeClick: PropTypes.func.isRequired,
    onStarUnstarClick: PropTypes.func.isRequired,
    moreIcon: PropTypes.bool,
    topic: PropTypes.object,
    tipViewMode: PropTypes.number,
  };

  static defaultProps = {
    moreIcon: true,
    tipViewMode: null
  };

  componentDidMount() {
    $('.tip-actions a[data-toggle="tooltip"]').tooltip();
  }

  handleCommentClick = e => {
    e.preventDefault();
    const { item, handleItemClick } = this.props;
    handleItemClick(item);
  };

  handleLikeClick = e => {
    e.preventDefault();
    const {
      item: { id, attributes: { liked_by_current_user } },
      onLikeUnlikeClick
    } = this.props;
    onLikeUnlikeClick(id, liked_by_current_user);
  };

  handleStarClick = e => {
    e.preventDefault();
    const {
      item: { id, attributes: { starred_by_current_user } },
      onStarUnstarClick
    } = this.props;
    onStarUnstarClick(id, starred_by_current_user);
  };

  render() {
    const { item, moreIcon, removeItem, archiveItem, topic, tipViewMode } = this.props;
    const {
      starred_by_current_user,
      liked_by_current_user,
      likes_count,
      comments_count
    } = item.attributes;

    let likeIconColor = grey;
    let starIconColor = grey;

    if (liked_by_current_user) {
      likeIconColor = red;
    }

    if (starred_by_current_user) {
      starIconColor = orange;
    }

    let likeAction = null;
    if (Ability.can('like', 'self', item)) {
      likeAction = (
        <a
          onClick={this.handleLikeClick}
          className="btn-like flex-r-center-center"
        >
          <div className="count-icon">
            <svg
              width="15px"
              height="15px"
              viewBox="0 0 14 13"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="TipFeed" stroke="none" fill="none">
                <g
                  id="Artboard"
                  transform="translate(-315.000000, -460.000000)"
                  fill={likeIconColor}
                >
                  <path
                    d="M322,461.463 C321.237,460.567 320.068,460 318.85,460 C316.694,460 315,461.694 315,463.85 C315,466.496 317.38,468.652 320.985,471.928 L322,472.845 L323.015,471.921 C326.62,468.652 329,466.496 329,463.85 C329,461.694 327.306,460 325.15,460 C323.932,460 322.763,460.567 322,461.463 Z"
                    id="Heart"
                  />
                </g>
              </g>
            </svg>
          </div>
          <span className="count-indicator">{likes_count}</span>
        </a>
      );
    }

    const starAction = (
      <a onClick={this.handleStarClick}>
        <i className="fa fa-star fa-lg" style={{ color: starIconColor }} />
      </a>
    );

    let commentAction = null;
    if (Ability.can('comment', 'self', item)) {
      commentAction = (
        <a className="btn-comment flex-r-center-center" onClick={this.handleCommentClick}>
          <div className="count-icon">
            <svg width="15px" height="15px" viewBox="0 0 14 14" version="1.1">
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <path
                  d="M1.75400755,10.9361709 C1.67424111,11.2977104 1.54661451,11.6641547 1.3786947,12.0293894 C1.27380855,12.2575225 1.16145849,12.4658214 1.04988923,12.6487941 C0.985277942,12.7547561 0.937617112,12.8256333 0.915305284,12.8562554 C0.532129514,13.3821492 0.988566,14.1060495 1.6282646,13.9869964 C1.66469175,13.9802171 1.72848223,13.9676275 1.81581014,13.94927 C1.95890771,13.919189 2.11774939,13.883442 2.28855325,13.842047 C2.77774203,13.7234901 3.26756072,13.5827402 3.72912428,13.4189561 C4.23045286,13.2410616 4.66753702,13.0475579 5.02994247,12.8312256 C5.50485201,12.9416165 5.99970292,13 6.50817299,13 L7.49182701,13 C11.099191,13 14,10.0898509 14,6.5 C14,2.91745375 11.0861917,0 7.49182701,0 L6.50817299,0 C2.90080905,0 0,2.91014913 0,6.5 C0,8.21279151 0.666018619,9.77356068 1.75400755,10.9361709 Z"
                  id="Bubble"
                  fill={grey}
                />
              </g>
            </svg>
          </div>
          <span className="count-indicator">{comments_count}</span>
        </a>
      );
    }

    let tipActionListDropdown = null;
    if (Ability.can('update', 'self', item) && moreIcon) {
      tipActionListDropdown = (
        <TipActionListDropdown
          item={item}
          removeItem={removeItem}
          archiveItem={archiveItem}
          topic={topic}
          tipViewMode={tipViewMode}
        />
      );
    }

    return (
      <div className="tip-actions">
        {commentAction}
        {likeAction}
        {starAction}
        {tipActionListDropdown}
      </div>
    );
  }
}

export default TipActions;
