import React from 'react';
import FileUploadItem from './file_upload_item';
import createClass from 'create-react-class';

var FileUploadList = createClass({
  getDefaultProps: function() {
    return {
      uploadedFiles: []
    };
  },

  render: function() {
    var uploadedFiles = this.props.uploadedFiles;

    var fileRows = [];
    for (var i = 0; i < uploadedFiles.length; i++) {
      var file      = uploadedFiles[i];
      var localData = file.localData;
      var fileData  = file.response.data;
      var fileLink  = file.fileLink;
      var fileRow = <FileUploadItem key={'file-upload-item-' + fileData.id} localData={localData} 
                                    fileData={fileData} handleFileDelete={this.props.handleFileDelete}
                                    fileLink={fileLink} />;
      fileRows.push(fileRow);
    }

    return (
      <div className="file-upload-list">
        {fileRows}
      </div>
    );
  }
});

export default FileUploadList;
