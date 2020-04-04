import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import orderBy from 'lodash/orderBy';
import ItemImagesPreview from 'Src/components/shared/items_container/item_images_preview.js';
import get from 'lodash/get';
import ImageWithLoader from 'Components/shared/ImageWithLoader';
import IconButton from 'Components/shared/buttons/IconButton';

const SheetImagesCell = ({ card, setEditCardModalOpen }) => {
  const images = get(card, 'attributes.attachments_json.images', []);

  return (
    <div className="flex-r-wrap-start">
      {images.map(image => (
        <ImageWithLoader
          key={image.file_small_url}
          url={image.file_small_url}
        />
      ))}

      <IconButton
        additionalClasses="sheet-view__card-title-edit-btn"
        fontAwesome
        icon="pencil"
        onClick={() => setEditCardModalOpen({ cardId: card.id, tab: 'Edit' })}
      />
    </div>
  );
};

export default {
  cssModifier: 'images p-x-5px',
  display: 'Images',
  resizableProps: {
    minWidth: '100'
  },
  Component: SheetImagesCell,
  renderSummary: () => null,
  sort(cards, order) {
    return orderBy(
      cards,
      card => get(card, 'attributes.attachments_json.images', []).length,
      order
    );
  }
};
