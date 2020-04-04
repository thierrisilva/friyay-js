import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { updateTopic } from 'Src/newRedux/database/topics/thunks';;

/**
 * New wrapper for FilePicker/filepicker-js
 * 
 */
class FilePickerUpload extends React.Component {
  static propTypes = {
    topic: PropTypes.object.isRequired,
    updateTopic: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    uploadType: PropTypes.string,
  }

  static defaultProps = {
    uploadType: "upload"
  }

  constructor(props) {
    super(props);

    this.updateTopic = props.updateTopic;
    this.onClose = props.onClose;
  }

  componentDidMount = () => {
    let _this = this;
    const { uploadType } = this.props;

    let fileServices = ['COMPUTER', 'DROPBOX', 'BOX', 'IMAGE_SEARCH'];

    switch (uploadType) {
      case 'link':
        fileServices = ['GOOGLE_DRIVE', 'DROPBOX', 'BOX'];
        break;
    }

    // iframe-messing-with-history fix
    const historyLength = window.history.length;

    filepicker.pickMultiple(
      {
        services: fileServices
      },

      (response) => {
        $(response).each((index, file) => {
          (async () => {
            try {
              if (uploadType === 'upload') {
                await _this.grabFileUpload(file);
              }
              _this.onClose();
            } catch (exception) {
              console.error(exception);
            }
          })();
        });

        // iframe-messing-with-history fix
        window.history.go(historyLength - window.history.length);
      },

      (error) => {
        _this.onClose();
        console.error(error);

        _this.setState({
          fetchingExternalUploads: false
        });
      }
    );
  }

  grabFileUpload = async (file) => {
    const { topic } = this.props;
    try {
      await this.updateTopic({
        attributes: {
          remote_image_url: file.url
        },
        id: topic.id,
      });
    } catch (exception) {
      console.error(exception);
    }
  }

  handleFileDelete = (fileID, fileType) => {
    let _this = this;
    let { uploadedFiles } = _this.state;

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this file?',
      callback(value) {
        if (value) {
          let $deleteXHR = APIRequest.delete({
            resource: 'attachments/' + fileID
          });

          $deleteXHR.done((response, status, xhr) => {
            $(uploadedFiles).each((index, file) => {
              if (parseInt(file.response.data.id) === parseInt(fileID)) {
                uploadedFiles.splice(index, 1);
                return false;
              }
            });

            _this.setState({
              uploadedFiles: uploadedFiles
            });

            if (_this.props.removeUploadedFile !== null) {
              _this.props.removeUploadedFile(fileID);
            }

            _this.updateFileIDs();
          }).fail((xhr, status, error) => {
            APIRequest.showErrorMessage(`Unable to delete file: ${error}`);
          });
        }
      }
    });
  }

  render() {
    return (
      <div></div>
    );
  }
}

const mapDispatchToProps = {
  updateTopic
}

export default connect(undefined, mapDispatchToProps)(FilePickerUpload);