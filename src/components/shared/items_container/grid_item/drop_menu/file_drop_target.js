import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from '../../../../../lib/item_types';

const fileDropTarget = {
  // canDrop(props, monitor) {
  //
  // },
  //
  // hover(props, monitor, component) {
  //
  // },

  drop(props, monitor) {
    return props;
  }
};

function collect(connect, monitor) {
  let dropItem = null;

  if (monitor) {
    dropItem = monitor.getItem();
  }

  return {
    connectDropTarget: connect.dropTarget(),
    canDrop:           monitor.canDrop(),
    dropHovered:       monitor.isOver(),
    dropItem:          dropItem
  };
}

class FileDropTarget extends React.Component {
  render() {
    let { connectDropTarget, dropItem, canDrop, dropHovered, method, displayMode } = this.props;

    let fileDropTargetClass = classNames('file-drop-target',
      { 'drop-highlighted': canDrop, 'inline': displayMode === 'inline' });

    let defaultItemType = 'file';

    if(dropItem && dropItem.hasOwnProperty('fileItem') && dropItem.hasOwnProperty('provider')){
      let { provider, fileItem } = dropItem;
      defaultItemType = fileItem && fileItem.itemType;

      switch (provider) {
        case 'google':
          if (
            method === 'upload' && (
              fileItem.mimeType.match(new RegExp(/google-apps.spreadsheet/, 'g')) ||
              fileItem.mimeType.match(new RegExp(/google-apps.document/, 'g')) ||
              fileItem.mimeType.match(new RegExp(/google-apps.presentation/, 'g'))
            )
          ) {
            return null;
          }
          break;
      }

      if (method === 'upload' && defaultItemType === 'folder') return null;
    }

    return connectDropTarget(
      <div className={fileDropTargetClass}>
        <p className="text-center">Drop file here to {method} the {defaultItemType}</p>
      </div>
    );
  }
}

FileDropTarget.defaultProps = {
  method:      'link',
  displayMode: 'default'
};

FileDropTarget.propTypes = {
  dropItem:          PropTypes.object,
  canDrop:           PropTypes.bool,
  dropHovered:       PropTypes.bool,
  connectDropTarget: PropTypes.func.isRequired,
  method:            PropTypes.oneOf(['link', 'upload']),
  target:            PropTypes.object,
  displayMode:       PropTypes.oneOf(['default', 'inline'])
};

export default DropTarget(ItemTypes.FILE_ITEM, fileDropTarget, collect)(FileDropTarget);
