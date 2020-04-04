import React from 'react';
import tiphive from '../../../lib/tiphive';
import createClass from 'create-react-class';

var FileUploadItem = createClass({
  componentDidMount: function() {
    var localData = this.props.localData;
    var fileData  = this.props.fileData;
    if (localData.preview) {
      $('#file-preview-' + fileData.id).html(localData.preview);
    }
  },

  render: function() {
    var localData = this.props.localData;
    var fileData  = this.props.fileData;
    const { fileLink } = this.props;
    var fileURL  = fileData.attributes.file_url;
    var fileName = tiphive.baseName(fileURL);

    var preview = <i className="fa fa-file-o" style={{fontSize: '24px'}}></i>;
    var previewStyle = {
      backgroundImage: 'url(' + (fileLink || fileData.attributes.file_small_url) + ')',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: '100px',
      width: '100px'
    };

    if (fileData.type === 'images' && fileData.attributes.file_small_url) {
      preview = <div className="img-preview" style={previewStyle}></div>;
    }

    return (
      <div className="file-upload-item flex-r-start-spacebetween" id={'file-upload-item-' + fileData.id}>
        <div id={'file-preview-' + fileData.id}>
          {preview}
        </div>
        <div className="flex-1">
          <span className="ml15">{fileName}</span>
        </div>
        <button type="button" className="close" 
                onClick={() => this.props.handleFileDelete(fileData.id, fileData.type)}>
          <span aria-hidden="true">×</span>
        </button>
      </div>
    );
  }
});

export default FileUploadItem;
