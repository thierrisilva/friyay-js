import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ImageWithLoader from 'Components/shared/ImageWithLoader';

export default class ItemImagesPreview extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    images: PropTypes.array
  };

  static defaultProps = {
    images: []
  };

  componentDidMount() {
    const { props: { item: { id } } } = this;

    $(`#carousel-image-preview-${id}`).carousel({
      interval: 2000
    });
  }

  render() {
    const { props: { item, images } } = this;

    return (
      <div className="item-images-preview-list">
        {item !== null &&
          images.length > 0 && (
            <div
              id={`carousel-image-preview-${item.id}`}
              className="carousel slide carousel-fade"
              data-ride="carousel"
            >
              <div className="carousel-inner" role="listbox">
                {images.map((image, index) => (
                  <div
                    className={classNames('item', { active: index === 0 })}
                    key={`item-image-preview-${image.id}`}
                  >
                    <div className="carousel-image-box">
                      <ImageWithLoader url={image.file_small_url} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  }
}
