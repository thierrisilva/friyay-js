import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import tiphive from '../../lib/tiphive';

let $modalDialog;

class PageModal extends Component {
  static defaultProps = {
    location: 'primary',
    backdrop: true,
    keyboard: true,
    width: null,
    height: null,
    anim: 'fade',
    size: 'full'
  };

  static propTypes = {
    location: PropTypes.string,
    backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    keyboard: PropTypes.bool,
    anim: PropTypes.string,
    size: PropTypes.string,
    extraClass: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    alignClass: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]),
    onClose: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.modalContainer = document.createElement('div');
    this.modalContainer.setAttribute('id', `${props.location}-dialog`);
    document.body.appendChild(this.modalContainer);
  }

  componentDidMount() {
    const {
      props: { location, keyboard }
    } = this;
    $modalDialog = $(`#${location}-modal`);
    $modalDialog.modal({ backdrop: false, keyboard });
    setTimeout(() => {
      $('input.tip-title').focus();
    });

    tiphive.hideTutorialElements();
    tiphive.detectModalScrollEnd();
  }

  componentWillUnmount() {
    document.body.removeChild(this.modalContainer);
    tiphive.showTutorialElements();
    $modalDialog.modal('hide');
  }

  render() {
    const {
      props: {
        location,
        anim,
        size,
        extraClass,
        width,
        height,
        alignClass,
        children
      }
    } = this;
    const modalClass = classNames(
      'modal',
      'page-modal',
      'page-modal-design-v2',
      anim
    );
    const modalDialogClass = classNames(
      'modal-dialog',
      `modal-${size}`,
      alignClass
    );
    const modalContentClass = classNames('modal-content', extraClass);

    return ReactDOM.createPortal(
      [
        <div
          key={`${location}-modal`}
          className={modalClass}
          tabIndex="-1"
          id={`${location}-modal`}
        >
          <div className={modalDialogClass} style={{ width, height }}>
            <div className={modalContentClass}>{children}</div>
          </div>
        </div>
      ],
      this.modalContainer
    );
  }
}

export default PageModal;
