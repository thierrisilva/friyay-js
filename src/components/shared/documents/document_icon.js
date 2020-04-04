import React from 'react';
import PropTypes from 'prop-types';
import last from 'lodash/last';

const DocumentIcon = ({ documentName = "", fontSize, style}) => {

  const fontAwesomeIconAndColor = (() => {
    //Not necessarily the smartest way to achieve this, but very easy to manage:
    if ( !documentName ) {
      return ['fa fa-file-o text-muted', '#BCBEBE'];
    }

    switch ( last( documentName.split('.') ) ) {
      case 'doc':
      case 'docm':
      case 'docx':
      case 'dotm':
      case 'dotx':
        return ['fa fa-file-word-o text-muted', '#2D5998'];
      case 'html':
        return ['fa fa-file-code-o text-muted', '#E24E30'];
      case 'pdf':
        return ['fa fa-file-pdf-o text-muted', '#C70C15'];
      case 'pps':
      case 'ppt':
      case 'pptm':
      case 'pptx':
      case 'potm':
      case 'potx':
      case 'ppsm':
      case 'ppsx':
        return ['fa fa-file-powerpoint-o text-muted', '#F33C1D'];
      case 'txt':
        return ['fa fa-file-text-o text-muted', '#4E92ED'];
      case 'xlm':
      case 'xls':
      case 'xlt':
      case 'xlsm':
      case 'xlst':
      case 'xlsx':
      case 'xltm':
      case 'xltx':
      case 'xlw':
        return ['fa fa-file-excel-o text-muted', '#1F744D'];
      case 'mp4':
      case 'avi':
        return ['fa fa-file-movie-o text-muted', '#4E92ED'];
      case 'bmp':
      case 'gif':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'svg':
      case 'tiff':
        return ['fa fa-file-image-o text-muted', '#61528C'];
      case 'zip':
      case 'rar':
        return ['fa fa-file-zip-o text-muted', '#D8544A'];
      default:
        return ['fa fa-file-o text-muted', '#BCBEBE'];
    };
  })();

  const iconStyle = {
    fontSize: fontSize ? fontSize : '1.5em',
    color: fontAwesomeIconAndColor[1],
    ...style,
  };

  return (
    <i className={fontAwesomeIconAndColor[0]} style={iconStyle}></i>
  );
};

DocumentIcon.propTypes = {
  documentName: PropTypes.string.isRequired,
  fontSize: PropTypes.string,
};

export default DocumentIcon;
