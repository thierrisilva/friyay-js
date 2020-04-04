/*  globals filepicker */
import React from 'react';
import PropTypes from 'prop-types';
import { failure } from 'Utils/toast';

const RightDesignFileUpload = ({ onChange }) => {
  const handleFilePicker = () => {
    const fileServices = ['COMPUTER', 'DROPBOX', 'BOX', 'IMAGE_SEARCH'];

    filepicker.pick(
      { services: fileServices },
      response => {
        grabFileUpload(response);
      },
      () => {
        failure('Cancelled file upload');
      }
    );
  };

  const grabFileUpload = async file => {
    onChange(file.url);
  };

  return (
    <div className="Right-design-upload form-group file-action-buttons-section">
      <button
        onClick={handleFilePicker}
        type="button"
        className="btn js-file-upload-box-button"
      >
        Upload
      </button>
    </div>
  );
};

RightDesignFileUpload.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default RightDesignFileUpload;
