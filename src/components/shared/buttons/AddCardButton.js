import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { setEditCardModalOpen } from 'Src/newRedux/interface/modals/actions';

const AddCardButton = ({
  buttonText,
  isActive,
  onAddCardClick,
  className,
  setEditCardModalOpen,
  openFileUploader = false,
  ...defaultProps
}) => {
  const handleButtonClick = e => {
    e.preventDefault();
    onAddCardClick && defaultProps.topic
      ? onAddCardClick()
      : setEditCardModalOpen({
          cardId: null,
          tab: 'Edit',
          openFileUploader,
          ...defaultProps
        });
  };

  return (
    <Fragment>
      <button
        className={classNames(
          'btn btn-noback',
          { active: isActive },
          { 'upload-btn': openFileUploader },
          className
        )}
        onClick={handleButtonClick}
      >
        {buttonText ? buttonText : '+'}
      </button>
    </Fragment>
  );
};

AddCardButton.propTypes = {
  isActive: PropTypes.bool,
  onAddCardClick: PropTypes.func,
  setEditCardModalOpen: PropTypes.func.isRequired
};

const mapDispatch = { setEditCardModalOpen };

export default connect(
  null,
  mapDispatch
)(AddCardButton);
