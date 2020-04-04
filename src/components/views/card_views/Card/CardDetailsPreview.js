import React, { Component, Fragment } from 'react';

import CardDetailsHeader from './CardDetailsHeader';
import CardDetailsFooter from './CardDetailsFooter';
import CardDocuments from 'Components/pages/item_page/item_content_documents';
import CardNestedCards from './CardNestedCards';
import CardImages from 'Components/pages/item_page/item_content_images';
import CardSlackLinks from 'Components/pages/item_page/item_content_slacklinks';
import CardTipLinks from 'Components/pages/item_page/item_content_tip_links';
import StringHelper from 'Src/helpers/string_helper';

class CardDetailsPreview extends Component {
  render() {
    const {
      card,
      onDoubleClick,
      showMinMax,
      showIcons,
      showTitle,
      handleShowHide,
      showDots
    } = this.props;
    const {
      attributes: { attachments_json = {}, body, title },
      relationships: { attachments }
    } = card;
    const { data: documents } = attachments || {};
    const { tip_links, images, slack_links } = attachments_json;

    return (
      <Fragment>
        <CardDetailsHeader
          card={card}
          onEditClick={onDoubleClick}
          showMinMax={showMinMax}
          handleShowHide={handleShowHide}
          showIcons={showIcons}
          showDots={showDots}
        />
        <div className="card-details-preview">
          <div
            className="card-details-preview_content"
            onDoubleClick={onDoubleClick}
          >
            {showTitle && (
              <h2
                className="card-details-preview_title"
                dangerouslySetInnerHTML={{
                  __html: StringHelper.simpleFormat(
                    title ||
                      '<span class="text-muted">Double click to edit</span>'
                  )
                }}
              />
            )}
            <div
              className="item-text"
              dangerouslySetInnerHTML={{
                __html: StringHelper.simpleFormat(
                  body ||
                    '<span class="text-muted card-details-preview_placeholder-text">Double click to edit</span>'
                )
              }}
            />
          </div>

          <CardNestedCards card={card} />

          {tip_links && tip_links.length > 0 && (
            <CardTipLinks item={card} tipLinks={tip_links} showDescription />
          )}

          {documents && documents.length > 0 && (
            <CardDocuments item={card} documents={documents} />
          )}

          {images && images.length > 0 && (
            <div className="form-group">
              <CardImages item={card} images={images} />
            </div>
          )}

          {slack_links && slack_links.length > 0 && (
            <div className="form-group">
              <CardSlackLinks item={card} slacklinks={slack_links} />
            </div>
          )}
        </div>
        {showIcons && (
          <CardDetailsFooter
            card={card}
            toggleComments={this.props.toggleComments}
            hideComments={this.props.hideComments}
          />
        )}
      </Fragment>
    );
  }
}

export default CardDetailsPreview;
