import React from 'react';
import createClass from 'create-react-class';
import Auth from '../../../lib/auth';
import APIRequest from '../../../lib/ApiRequest';

var FileUpload = createClass({
  getDefaultProps: function() {
    return {
      objectType: 'tip',
      objectInstance: null
    };
  },

  getInitialState: function() {
    return {
      progress: 0
    };
  },

  handleDropZoneClick: function(e) {
    e.preventDefault();

    var objectType = this.props.objectType;

    $('#' + objectType + '-upload-input').click();
  },

  componentDidMount: function() {
    var _this = this;

    var objectType     = this.props.objectType;
    var objectInstance = this.props.objectInstance;

    var acceptFileTypes = /(\.|\/)(gif|jpe?g|png|docx?|xlsx?|pptx?|txt|pdf|epub|csv|mp3|pages|wav|numbers|zip)$/i;

    var uploadURL = window.API_URL + '/attachments.json';
    if (objectInstance) {
      uploadURL = window.API_URL + '/' + objectInstance.type + '/' + objectInstance.id + '/attachments.json';
    }

    $('#' + objectType + '-upload-input').fileupload({
      autoUpload: true,
      url: uploadURL,
      dataType: 'json',
      headers: { Authorization: 'Bearer ' + Auth.getCookie('authToken') },
      formData: {},
      paramName: 'data[attributes[file]]',
      dropZone: $('#' + objectType + '-file-drop'),
      pasteZone: $('#' + objectType + '_body'),
      filesContainer: $('#' + objectType + '-files-container'),
      acceptFileTypes: acceptFileTypes,
      maxFileSize: 100 * 1024 * 1024,
      // Enable image resizing, except for Android and Opera,
      // which actually support image resizing, but fail to
      // send Blob objects via XHR requests:
      disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
      previewMaxWidth: 100,
      previewMaxHeight: 100,
      previewCrop: true
    }).on('fileuploadadd', function (e, data) {
      _this.setState({
        progress: 0
      });
    }).on('fileuploadprocessalways', function (e, data) {
      var index   = data.index;
      var file    = data.files[index];
      var context = data.context;

      // if (file.preview) {}

      if (file.error) {
        APIRequest.showErrorMessage(file.error);
      }
    }).on('fileuploadprogressall', function (e, data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);

      _this.setState({
        progress: progress
      });
    }).on('fileuploaddone', function (e, data) {
      var fileResponse = data.result;

      var uploadedFile = {
        response: fileResponse,
        localData: data.files[0]
      };

      _this.props.addUploadedFile(uploadedFile);

      // APIRequest.showInfoMessage(uploadedFile.localData.name + ' is uploaded successfully');
    }).on('fileuploadfail', function (e, data) {

    });
  },

  render: function() {
    var objectType = this.props.objectType;
    var progress   = this.state.progress;

    return (
      <div className="file-upload">
        <div className="file-drop" id={objectType + '-file-drop'} ref={objectType + 'FileDrop'}
             onClick={this.handleDropZoneClick}>
          Click To Upload or Drag & Drop Attachments Here (Images, .doc, .xls, .ppt, .pdf)
        </div>

        <div id={objectType + '-upload-progress'} className="progress">
          <div className="progress-bar progress-bar-success" aria-valuenow={progress} aria-valuemin="0"
               aria-valuemax="100" style={{width: progress + '%'}}>
            {progress}%
          </div>
        </div>
        <div id={objectType + '-files-container'} className="files-container"></div>
      </div>
    );
  }
});

export default FileUpload;