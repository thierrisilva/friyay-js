/*  globals vex filepicker devLog */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FileUpload from './file_upload_box/file_upload';
import { failure } from 'Utils/toast';
import FileUploadList from './file_upload_box/file_upload_list';
import APIRequest, { ApiRequest } from '../../lib/ApiRequest';

class FileUploadBox extends Component {
  state = {
    uploadedFiles: [],
    fetchingExternalUploads: false
  };

  componentDidMount = () => {
    let { uploadedFiles } = this.props;
    this.setState({ uploadedFiles });
  };

  componentWillReceiveProps = nextProps => {
    const newUploadedFiles = nextProps.uploadedFiles;
    this.setState(prevState => ({
      ...prevState,
      uploadedFiles: newUploadedFiles
    }));
  };

  addUploadedFile = uploadedFile => {
    let { uploadedFiles } = this.state;
    uploadedFiles.push(uploadedFile);
    this.setState({ uploadedFiles });
    this.updateFileIDs();

    // scroll to last uploaded file
    const tipTextAttachmentsElement = $('.tip-text-attachments')[0];
    tipTextAttachmentsElement.scrollTop =
      tipTextAttachmentsElement.scrollHeight;
  };

  grabFileUpload = async file => {
    this.setState({ fetchingExternalUploads: true });

    const attachment = await ApiRequest.post('attachments', {
      data: {
        attributes: {
          remote_file_url: file.url,
          mime_type: file.mimetype
        }
      }
    });

    const uploadedFile = {
      response: attachment.data,
      localData: {},
      fileLink: file.url
    };

    this.props.addUploadedFile(uploadedFile);
    this.setState({ fetchingExternalUploads: false });
  };

  grabFileLink = file => {
    // TODO: WHY DO WE NEED THIS?
    devLog('grabFileLink', file);
  };

  updateFileIDs = () => {
    let { objectType } = this.props;
    let { uploadedFiles } = this.state;
    let fileIDs = uploadedFiles.map(({ response }) => response.data.id);
    $('#' + objectType + '_attachment_ids').val(fileIDs.join(','));
  };

  handleFilePicker = e => {
    const _this = this;
    const $fileUploadLink = $(e.target);
    const uploadType = $fileUploadLink[0].dataset.type;

    const fileServices =
      uploadType === 'link'
        ? ['GOOGLE_DRIVE', 'DROPBOX', 'BOX']
        : ['COMPUTER', 'DROPBOX', 'BOX', 'IMAGE_SEARCH'];

    filepicker.pickMultiple(
      { services: fileServices },
      response => {
        response.forEach(file => {
          if (uploadType === 'upload') _this.grabFileUpload(file);
          if (uploadType === 'link') _this.grabFileLink(file);
        });
      },

      () => {
        failure('Cancelled file upload');
        _this.setState({ fetchingExternalUploads: false });
      }
    );
  };

  handleFileDelete = fileID => {
    let _this = this;
    let { uploadedFiles } = _this.state;

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this file?',
      callback(value) {
        if (value) {
          let $deleteXHR = APIRequest.delete({
            resource: 'attachments/' + fileID
          });

          $deleteXHR
            .done(() => {
              const updatedUploadFiles = uploadedFiles.filter(
                ({ response }) => `${response.data.id}` !== `${fileID}`
              );
              _this.setState({ uploadedFiles: updatedUploadFiles });

              if (_this.props.removeUploadedFile !== null) {
                _this.props.removeUploadedFile(fileID);
              }

              _this.updateFileIDs();
            })
            .fail((xhr, status, error) => {
              failure(`Unable to delete file: ${error}`);
            });
        }
      }
    });
  };

  renderExternalUploadBox = () => {
    let { tabIndex } = this.props;
    let { fetchingExternalUploads } = this.state;

    return (
      <div className="form-group file-action-buttons-section">
        <button
          type="button"
          className="btn js-file-upload-box-button"
          onClick={this.handleFilePicker}
          data-type="upload"
          tabIndex={tabIndex}
        >
          Upload File
        </button>

        {fetchingExternalUploads && (
          <span>
            Fetching files...
            <img src="/images/ajax-loader.gif" />
          </span>
        )}

        <button
          type="button"
          className="btn ml5"
          onClick={this.handleFilePicker}
          data-type="link"
        >
          Link to a File
        </button>
      </div>
    );
  };

  render() {
    let {
      objectType,
      objectInstance,
      enableOriginalFileUpload,
      uploadBoxStyle
    } = this.props;
    let { uploadedFiles } = this.state;
    let uploadedFileIDs = uploadedFiles.map(file => file.response.data.id);

    return (
      <div className="file-upload-box" style={uploadBoxStyle}>
        {enableOriginalFileUpload && (
          <FileUpload
            objectType={objectType}
            objectInstance={objectInstance}
            addUploadedFile={this.props.addUploadedFile}
          />
        )}

        {this.renderExternalUploadBox()}

        <section className="file-upload-list-section">
          <FileUploadList
            uploadedFiles={uploadedFiles}
            handleFileDelete={this.handleFileDelete}
          />
        </section>

        <input
          type="hidden"
          id={objectType + '_attachment_ids'}
          value={uploadedFileIDs.join(',')}
          ref={objectType + 'AttachmentIDs'}
        />
        <input
          type="file"
          id={objectType + '-upload-input'}
          className="hide"
          name={objectType + '_files[]'}
          multiple
        />
      </div>
    );
  }
}

FileUploadBox.defaultProps = {
  objectType: 'tip',
  objectInstance: null,
  uploadedFiles: [],
  enableOriginalFileUpload: false,
  removeUploadedFile: null
};

FileUploadBox.propTypes = {
  objectType: PropTypes.string,
  uploadedFiles: PropTypes.array,
  objectInstance: PropTypes.object,
  enableOriginalFileUpload: PropTypes.bool,
  tabIndex: PropTypes.number,
  removeUploadedFile: PropTypes.func,
  uploadBoxStyle: PropTypes.object,
  addUploadedFile: PropTypes.func
};

export default FileUploadBox;
