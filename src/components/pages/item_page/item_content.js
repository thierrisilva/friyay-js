import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import ItemContentTipLinks from './item_content_tip_links';
import ItemContentDocuments from './item_content_documents';
import ItemContentImages from './item_content_images';
import ItemContentSlacklinks from './item_content_slacklinks';
import CommentsBox from '../../shared/comments_box';
import ItemContentHeader from './item_content/item_content_header';
import ItemContentFooter from './item_content/item_content_footer';
import Ability from 'Lib/ability';
import LikeButton from 'Src/components/shared/cards/elements/LikeButton.js';
import StarButton from 'Src/components/shared/cards/elements/StarButton.js';

import CommentsList from 'Src/components/shared/comments/CommentsList';

import {
  setEditHidden,
  setEditActive
} from 'Actions/tipsModal';

import StringHelper from '../../../helpers/string_helper';

class ItemContent extends Component {
  static propTypes = {
    cardView: PropTypes.bool,
    onTopicClick: PropTypes.func,
    location: PropTypes.object,
    tip: PropTypes.object.isRequired,
    history: PropTypes.object,
    view: PropTypes.number,
  };

  componentDidMount() {
    $('.item-content a[data-toggle="tooltip"]').tooltip();
  }

  handleBodyClick = e => {
    e.preventDefault();
    const { props: { tip, onToggleEditMode } } = this;
    Ability.can('update', 'self', tip) && onToggleEditMode( true );
  }

  render() {
    const {
      props: {
        tip,
        cardView,
        handleEditClick,
        history,
        onTopicClick,
        view,
      },
    } = this;

    const {
      attributes: {
        title,
        body,
        color_index,
        attachments_json: {
          tip_links,
          documents,
          images,
          slack_links
        }
      }
    } = tip;



    const itemContentClass = `item-content fr-view color-${color_index}`;

    let tipLinksContent = null;
    if (tip_links && tip_links.length > 0) {
      tipLinksContent = (
        <ItemContentTipLinks
          item={tip}
          tipLinks={tip_links}
          showDescription
        />
      );
    }

    let documentsContent;
    if (documents && documents.length > 0) {
      documentsContent = (
        <ItemContentDocuments item={tip} documents={documents} />
      );
    }

    let imagesContent;
    if (images && images.length > 0) {
      imagesContent = (
        <div className="form-group">
          <ItemContentImages item={tip} images={images} />
        </div>
      );
    }

    let slacklinksContent;
    if (slack_links && slack_links.length > 0) {
      slacklinksContent = (
        <div className="form-group">
          <ItemContentSlacklinks item={tip} slacklinks={slack_links} />
        </div>
      );
    }

    return (
      <div className={itemContentClass}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div className="item-content-body">
          <ItemContentHeader
            tip={tip}
            cardView={cardView}
            handleEditClick={handleEditClick}
          />

          <div onDoubleClick={handleEditClick}>
            <h2 className="item-title">
              {title}
            </h2>

            <div
              className="item-text"
              dangerouslySetInnerHTML={{
                __html: StringHelper.simpleFormat(body || '')
              }}
            />
          </div>

          {tipLinksContent}
          {documentsContent}
          {imagesContent}
          {slacklinksContent}

          <div className="card-content-footer">
            <span></span>
            <div className="card-footer-btns">
              <LikeButton card={tip}/>
              <StarButton card={tip}/>
            </div>
          </div>
        </div>
        {/* <CommentsBox tip={tip} history={history} view={view} /> */}
        <CommentsList cardId={ tip.id }  />
      </div>
    );
  }
}


export default ItemContent;
