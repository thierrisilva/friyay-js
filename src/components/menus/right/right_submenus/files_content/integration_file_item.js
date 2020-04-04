import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { setShowAddCardBottomOverlay } from 'Src/newRedux/interface/modals/actions';
import GenericDragContainer from 'Src/components/shared/drag_and_drop/GenericDragContainer';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';

class IntegrationFileItem extends Component {

  handleItemDoubleClick(fileItem) {
    if (!fileItem || fileItem.itemType !== 'folder') return;

    let { provider, handleFolderChange } = this.props;
    let folderID   = fileItem.id;
    let folderName = fileItem.name;

    if (provider === 'dropbox') folderID = fileItem.path_lower;

    handleFolderChange({ folderID, folderName, nextPageToken: null });
  }

  getRowItem = (fileItemClass, iconClass, fileItem) => (
    <div
      onClick={() => fileItem.itemType == 'file' && this.props.getFileUrl(fileItem)}
      className={fileItemClass}
      onDoubleClick={() => this.handleItemDoubleClick(fileItem)}
    >
      <i className={iconClass} /> {fileItem.name}
    </div>
  );

  render() {
    let { provider, fileItem } = this.props;
    let fileItemClass = classNames('file-item', 'integration-file', `kind-${fileItem.itemType}`, `${provider}-file`);
    let iconClass = classNames('fa', `fa-${fileItem.itemType}`);

    return (
      <GenericDragContainer
        item={{fileItem, provider}}
        itemType={fileItem.itemType == 'file' ? dragItemTypes.FILE : dragItemTypes.FOLDER}
        dragPreview={this.getRowItem(fileItemClass, iconClass, fileItem)}
        onDropElsewhere={() => {}} // eslint-disable-line
      >
        { this.getRowItem(fileItemClass, iconClass, fileItem) }
      </GenericDragContainer>
    );
  }
}

IntegrationFileItem.propTypes = {
  provider:           PropTypes.oneOf(['dropbox', 'google', 'box']).isRequired,
  fileItem:           PropTypes.object.isRequired,
  handleFolderChange: PropTypes.func.isRequired,
  getFileUrl: PropTypes.func.isRequired
};

const mapDispatch = {
  setShowAddCardBottomOverlay,
};

export default connect(null, mapDispatch)(IntegrationFileItem);
