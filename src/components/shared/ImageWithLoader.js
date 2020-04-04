import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from 'Components/shared/Loader';

const LOADING_STATUS = {
  LOADING: 1,
  LOADED: 2,
  ERROR: 3
};

export default class ImageWithLoader extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired
  };

  state = { imageStatus: LOADING_STATUS.LOADING };

  handleImageLoaded = () => {
    this.setState(state => ({ ...state, imageStatus: LOADING_STATUS.LOADED }));
  };

  handleImageErrored = () => {
    this.setState(state => ({ ...state, imageStatus: LOADING_STATUS.ERROR }));
  };

  render() {
    const {
      state: { imageStatus },
      props: { url }
    } = this;
    return (
      <div>
        <img
          src={url}
          className="image-with-loading"
          onLoad={this.handleImageLoaded}
          onError={this.handleImageErrored}
        />
        {imageStatus === LOADING_STATUS.LOADING && (
          <div
            className="flex-c image-with-loading__msg--loading"
            style={{
              height: 128,
              justifyContent: 'center',
              backgroundColor: '#fafafa',
              borderRadius: 3
            }}
          >
            <p
              className="text-center mb5 text-muted"
              style={{ fontStyle: 'italic', color: '#999' }}
            >
              Image is loading
            </p>
            <p
              className="text-center mb0"
              style={{
                width: 40,
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              <Loader />
            </p>
          </div>
        )}
        {imageStatus === LOADING_STATUS.ERROR && (
          <div
            className="flex-c image-with-loading__msg--error"
            style={{
              height: 128,
              justifyContent: 'center',
              backgroundColor: '#fafafa',
              borderRadius: 3
            }}
          >
            <span
              className="material-icons text-center"
              style={{
                color: '#999'
              }}
            >
              visibility_off
            </span>
          </div>
        )}
      </div>
    );
  }
}
