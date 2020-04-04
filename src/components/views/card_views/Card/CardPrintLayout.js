import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import StringHelper from 'Src/helpers/string_helper';
import ItemContentImages from 'Components/pages/item_page/item_content_images';

class CardPrintLayout extends Component {
  // static propTypes = {
  // };

  render() {
    const { card, card: { attributes: { attachments_json = {}, title, body } } } = this.props;
    const images = attachments_json.images;

    return (
      <Fragment>
        <div id="item-page-section-to-print">
          <h1 className="item-title" id="js-item-title">
            {title}
          </h1>
          <div
            className="item-text"
            id="js-item-text"
            dangerouslySetInnerHTML={{
              __html: StringHelper.simpleFormat(body || '')
            }}
          />
          { images && images.length > 0 &&
            <div className="form-group">
              <ItemContentImages item={card} images={images}/>
            </div>
          }
        </div>
        <div className="clearfix" />
      </Fragment>
    );
  }
}


export default CardPrintLayout;
