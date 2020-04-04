import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from '../../lib/item_types';
import FileDropStore from '../../stores/file_drop_store';
import FileDropTarget from '../shared/items_container/grid_item/drop_menu/file_drop_target';
import MainFormPage from '../pages/MainFormPage';

let fileDropStoreListener;

const newTipDropZoneTarget = {
  drop(props, monitor) {

  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    dropHighlighted:   monitor.canDrop(),
    dropHovered:       monitor.isOver(),
  };
}

class NewTipDropZone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropState: FileDropStore.getState(),
      isMainFormOpen: false,
      dropMethod: null,
      dropFile: null
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.onDropChange = this.onDropChange.bind(this);
  }

  componentDidMount() {
    fileDropStoreListener = FileDropStore.addListener(this.onDropChange);
  }

  componentWillUnmount() {
    if (fileDropStoreListener) fileDropStoreListener.remove();
  }

  closeMainForm = () => 
    this.setState(state => ({ ...state, isMainFormOpen: false, dropMethod: null, dropFile: null }));

  onDropChange() {
    let dropState = FileDropStore.getState();

    this.setState({
      dropState: dropState
    });

    let dropMethod    = dropState.method;
    let uploadingFile = dropState.uploadingFiles['tips-new'];
    let uploadedFile  = dropState.updatedItems['tips-new'];

    if (!uploadingFile && uploadedFile) {
      // sending to main form
      
      this.setState(state => ({ ...state, isMainFormOpen: true, dropMethod, dropFile: uploadedFile }));
    }
  }

  render() {
    let { connectDropTarget, dropHighlighted, dropHovered } = this.props;
    let { group, topic, params } = this.props;

    let { dropState, dropFile, dropMethod, isMainFormOpen } = this.state;

    // check if sending or uploading operation is happening...
    let sendingDropFile = dropState.sendingDropFiles['tips-new'];
    let uploadingFile   = dropState.uploadingFiles['tips-new'];

    let dropZoneClass = classNames('new-tip-drop-zone',
      { 'drop-highlighted': dropHighlighted, 'uploading': sendingDropFile || uploadingFile });

    let newTipTarget = { type: 'tips', id: 'new' };

    let dropContent =
      <div className="drop-target-content">
        <FileDropTarget method="link" target={newTipTarget} displayMode="inline" />

        <FileDropTarget method="upload" target={newTipTarget} displayMode="inline" />
      </div>;

    if (sendingDropFile || uploadingFile) {
      dropContent =
        <div className="drop-target-content">
          <p className="text-center">Sending file...</p>
          <p className="text-center"><img src="/images/ajax-loader.gif" /></p>
        </div>;
    }

    return connectDropTarget(
      <div className={dropZoneClass}>
        <p className="text-center">Link or Upload a file to a new Card</p>
        {dropContent}
        {isMainFormOpen && (
          <MainFormPage 
            params={params} 
            group={group} 
            topic={topic} 
            dropMethod={dropMethod}
            dropFile={dropFile} 
          />
        )}
      </div>
    );
  }
}

NewTipDropZone.propTypes = {
  dropHighlighted:   PropTypes.bool,
  dropHovered:       PropTypes.bool,
  connectDropTarget: PropTypes.func.isRequired,
  group:             PropTypes.object,
  topic:             PropTypes.object,
  params:            PropTypes.object
};

export default DropTarget(ItemTypes.FILE_ITEM, newTipDropZoneTarget, collect)(NewTipDropZone);
