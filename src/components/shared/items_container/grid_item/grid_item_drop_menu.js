import React from 'react';
import PropTypes from 'prop-types';
import MainFormStore from '../../../../stores/main_form_store';
import FileDropStore from '../../../../stores/file_drop_store';
import FileDropTarget from './drop_menu/file_drop_target';

let fileDropListener;

class GridItemDropMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropState: FileDropStore.getState()
    };

    this.componentDidMount    = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.handleMenuCloseClick = this.handleMenuCloseClick.bind(this);
    this.onDropUpdate         = this.onDropUpdate.bind(this);
  }

  componentDidMount() {
    fileDropListener = FileDropStore.addListener(this.onDropUpdate);
  }

  componentWillUnmount() {
    if (fileDropListener) fileDropListener.remove();
  }

  handleMenuCloseClick(e) {
    e.preventDefault();

    this.props.switchScreen('item', null);
  }

  onDropUpdate() {
    let dropState = FileDropStore.getState();
    this.setState({
      dropState
    });

    let { item, switchScreen } = this.props;
    let { sendingDropFiles, uploadingFiles, updatedItems } = dropState;

    let itemKey = `${item.type}-${item.id}`;

    // if item attachment is uploaded
    if (updatedItems[itemKey] && updatedItems[itemKey].data) {
      switchScreen('item');
      MainFormStore.emitEventWithData(window.ITEM_UPDATE_EVENT, updatedItems[itemKey]);

      FileDropStore.clearItemUploadedFile(FileDropStore.getState(), { itemType: item.type, itemID: item.id });
    }
  }

  render() {
    let { item } = this.props;

    let itemKey = `${item.type}-${item.id}`;

    let { dropState } = this.state;
    let { sendingDropFiles, uploadingFiles, updatedItem } = dropState;

    let dropContent =
      <div className="drop-target-content">
        <FileDropTarget method="link" target={item} />

        <FileDropTarget method="upload" target={item} />
      </div>;

    if (sendingDropFiles[itemKey] || uploadingFiles[itemKey]) {
      dropContent =
        <div className="drop-target-content">
          <p className="text-center">Sending file...</p>
          <p className="text-center"><img src="/images/ajax-loader.gif" /></p>
        </div>;
    }

    let closeBtnStyle = {position: 'absolute', right: 0, top: 0};

    return (
      <div className="grid-item-menu grid-item-drop-menu">
        <button className="btn btn-link" type="button" data-dismiss="modal" aria-label="Close"
                onClick={this.handleMenuCloseClick} style={closeBtnStyle}>
          <span aria-hidden="true">&times;</span>
        </button>

        <p className="text-center">Link or Upload a file to this card</p>

        {dropContent}
      </div>
    );
  }
}

GridItemDropMenu.propTypes = {
  item:         PropTypes.object,
  switchScreen: PropTypes.func
};

export default GridItemDropMenu;
