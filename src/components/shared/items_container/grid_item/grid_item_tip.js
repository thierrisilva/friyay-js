import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import ItemImagesPreview from '../item_images_preview';
import ItemContentTipLinks from '../../../pages/item_page/item_content_tip_links';
import ItemContentDocuments from '../../../pages/item_page/item_content_documents';
import ItemContentLabels from '../../../pages/item_page/item_content_labels';
import Ability from 'Lib/ability';
import StringHelper from '../../../../helpers/string_helper';
import ItemAssignmentPath from '../../../shared/item_assignment_path';
import MoreIcon from '../../../shared/more_icon';
import tiphive from 'Lib/tiphive';
import moment from 'moment';
import UserAvatar from '../../user_avatar';
import { SCREEN } from 'Enums';
import { connect } from 'react-redux';
import toSafeInteger from 'lodash/toSafeInteger';
import CardAssigneeLabel from 'Components/shared/cards/elements/CardAssigneeLabel';
import CardDueDateLabel from 'Components/shared/cards/elements/CardDueDateLabel';
import CardWorkEstimationLabel from 'Components/shared/cards/elements/CardWorkEstimationLabel';

const orange = '#f2ab13';
const grey = '#d9d9d9';
const red = orange; // for now :( '#f44336';

class GridItemTip extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    handleItemClick: PropTypes.func.isRequired,
    switchScreen: PropTypes.func.isRequired,
    onLikeUnlikeClick: PropTypes.func.isRequired,
    group: PropTypes.object,
    onStarUnstarClick: PropTypes.func.isRequired,
    labelList: PropTypes.array
  };

  componentDidMount() {
    $('.grid-item-content a[data-toggle="tooltip"]').tooltip();
  }

  handleClick = e => {
    if (e.target.nodeName === 'A') {
      return;
    }

    e.preventDefault();
    this.props.handleItemClick(this.props.item);
  };

  handleLikeClick = e => {
    e.preventDefault();
    const {
      props: {
        item: { id, attributes: { liked_by_current_user } },
        onLikeUnlikeClick
      }
    } = this;
    onLikeUnlikeClick(id, liked_by_current_user);
  };

  handleStarClick = e => {
    e.preventDefault();
    const {
      props: {
        item: { id, attributes: { starred_by_current_user } },
        onStarUnstarClick
      }
    } = this;
    onStarUnstarClick(id, starred_by_current_user);
  };

  handleCommentClick = e => {
    e.preventDefault();
    this.props.handleItemClick(this.props.item);
  };

  handleMenuClick = e => {
    e.preventDefault();
    this.props.switchScreen(SCREEN.OPTIONS_MENU);
  };

  handleLabelsClick = e => {
    e.preventDefault();
    this.props.switchScreen(SCREEN.LABEL_LISTING);
  };

  renderHeader = item => {
    // TODO: Move this to a component
    const { group } = this.props;
    const isOwner = Ability.can('update', 'self', item);

    return (
      <div
        className="grid-item-header panel-heading"
        style={{
          marginTop: '1rem',
          height: '3.5rem'
        }}
      >
        <div className="header-text flex-1 flex-c">
          <ItemAssignmentPath group={group} item={item} maxCharacters={30} />
        </div>
        {isOwner && (
          <div
            className="header-options flex-r-center"
            style={{ alignSelf: 'flex-start' }}
          >
            <a onClick={this.handleMenuClick} className="btn btn-sm btn-menu">
              <MoreIcon />
            </a>
          </div>
        )}
      </div>
    );
  };

  fetchBody = (body, length) => {
    const string = (body && body.toString()) || '';

    return string.length > length
      ? `${string.substring(0, length).replace(/^\s+|\s+$/g, '')}...`
      : string;
  };

  renderBody = item => {
    // TODO: Move this to a component
    const { attributes: { title, body } } = item;
    const {
      images = [],
      tip_links = [],
      documents = []
    } = item.attributes.attachments_json;

    const firstImage = images.length > 0 ? [images[0]] : [];
    const firstLink = tip_links.length > 0 ? [tip_links[0]] : [];

    const formattedBody = this.fetchBody(body, 375);
    const bodyClass = classNames({
      'item-text': true,
      'item-text-expandable': firstLink.length > 0
    });

    let preview = (
      <div
        className={bodyClass}
        dangerouslySetInnerHTML={{
          __html: StringHelper.simpleFormat(formattedBody)
        }}
      />
    );

    if (documents.length > 0) {
      if (documents.length < 3) {
        preview = (
          <ItemContentDocuments
            item={item}
            documents={documents}
            isGrid
          />
        );
      } else {
        preview = [
          <ItemContentDocuments
            key={`docs-${item.id}`}
            item={item}
            documents={documents.slice(0, 2)}
            isGrid
          />,
          <ItemContentDocuments
            key={`docs-collpased-${item.id}`}
            item={item}
            documents={documents.slice(2)}
            isGrid
          />
        ];
      }
    } else if (firstLink.length > 0) {
      preview = <ItemContentTipLinks item={item} tipLinks={firstLink} isGrid />;
    } else if (firstImage.length > 0) {
      preview = <ItemImagesPreview item={item} images={firstImage} />;
    }

    return (
      <div className="panel-body render-body">
        <h3 className="item-title" onClick={this.handleClick}>
          <span className="title-truncated">
            {StringHelper.truncate(title, 40)}
          </span>
          <span className="title-full">{title}</span>
        </h3>
        <div className="item-body fr-view" onClick={this.handleClick}>
          {preview}
        </div>
      </div>
    );
  };

  renderFooter = item => {
    // TODO: Move this to a component
    const {
      liked_by_current_user: isLiked,
      starred_by_current_user: isStarred,
      likes_count: likeCount,
      comments_count: commentCount
    } = item.attributes;
    const canComment = Ability.can('comment', 'self', item);
    const canLike = Ability.can('like', 'self', item);

    const likeIconColor = isLiked ? red : grey;
    const starIconColor = isStarred ? orange : grey;

    return (
      <div className="panel-footer">
        {!tiphive.userIsGuest() && (
          <a onClick={this.handleLabelsClick} className="btn-label">
            <i className="fa fa-tag fa-lg" />
          </a>
        )}
        {canComment && (
          <a onClick={this.handleCommentClick}>
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
                    fill="#D9D9D9"
                  />
                </g>
              </svg>
            </div>
            <span className="count-indicator">{commentCount}</span>
          </a>
        )}
        {canLike && (
          <a onClick={this.handleLikeClick} className="heart">
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
            <span className="count-indicator">{likeCount}</span>
          </a>
        )}
        <a className="btn-star" onClick={this.handleStarClick}>
          <i className="fa fa-star fa-lg" style={{ color: starIconColor }} />
        </a>
      </div>
    );
  };

  render() {
    const { props: { item, labelList } } = this;
    const {
      relationships: { labels: { data: labels } },
      attributes: { creator, updated_at }
    } = item;

    let labelsContent = null;
    if (labels && labels.length > 0) {
      labelsContent = <ItemContentLabels tip={item} labels={labels} />;
    }

    // NOTE: all this is because of nested props
    const ids = labels.map(label => toSafeInteger(label.id));
    const barSegments =
      labelList.length === 0
        ? labels.map(label => (
            <div
              key={`label-top-bar${item.id}-${label.id}`}
              className={`label-bar bg-color-${label.color} labels-${labels.length}`}
            />
          ))
        : labelList
            .filter(label => ids.includes(toSafeInteger(label.id)))
            .map(label => (
              <div
                key={`label-top-bar${item.id}-${label.id}`}
                className={`label-bar bg-color-${label.attributes
                  .color} labels-${labels.length}`}
              />
            ));

    return (
      <div className="grid-item-content">
        <div className="indicator-bar">{barSegments}</div>
        {this.renderHeader(item)}
        <div className="clearfix" />
        {this.renderBody(item)}
        <div
          className="flex-r-center-spacebetween"
          style={{ borderTop: '1px solid #f0f0f0' }}
        >
          <div className="labels-root">{labelsContent}</div>
          {this.renderFooter(item)}
        </div>
        <div
          className="flex-r-center-spacebetween"
          style={{ padding: '1rem 1.5rem' }}
        >
          <div className="flex-1 flex-r-center-start">
            <UserAvatar user={ creator } margin={20} />
            <CardAssigneeLabel
              card={item}
              className="grid-item-plan-property"
              showTooltip
            />
            <CardDueDateLabel
              card={item}
              className="grid-item-plan-property"
              hideOnUndefinedValue={true}
              showTooltip
            />
            <CardWorkEstimationLabel
              card={item}
              className="grid-item-plan-property"
              hideOnUndefinedValue={true}
              showTooltip
            />
          </div>
          <div className="flex-1 flex-r-center-end">
            <span style={{ color: '#bfbfbf' }}>
              {moment(updated_at).format('DD MMM YY')}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = ({ labels: { collection } }) => ({ labelList: collection });
export default connect(mapState)(GridItemTip);
