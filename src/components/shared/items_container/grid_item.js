import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from '../../../lib/item_types';
import FileDropStore from '../../../stores/file_drop_store';
import GridItemTip from './grid_item/grid_item_tip';
import GridItemMenu from './grid_item/grid_item_menu';
import ItemLabelsListing from './grid_item/labels/item_labels_listing';
import ItemLabelsForm from './grid_item/labels/item_label_form';
import GridItemDropMenu from './grid_item/grid_item_drop_menu';
import { filterTipBySlug } from '../../../actions/tipsFilter';
import MainFormPage from '../../pages/MainFormPage';
import { SCREEN } from 'Enums';

const gridItemTarget = {
  drop(props, monitor, component) {
    let { item, screen, dropState } = component.state;

    const hasDroppedOnChild = monitor.didDrop();
    if (!hasDroppedOnChild) {
      component.switchScreen(SCREEN.ITEM);

      return;
    }

    let sendingDropFile = dropState.sendingDropFiles[`${item.type}-${item.id}`];
    let uploadingFile = dropState.uploadingFiles[`${item.type}-${item.id}`];

    let doingUpload = sendingDropFile || uploadingFile;

    if (doingUpload && screen === SCREEN.ITEM) {
      component.switchScreen(SCREEN.DROP_MENU);
    }
  }
};

const collect = (connector, monitor) => ({
  connectDropTarget: connector.dropTarget(),
  dropHighlighted: monitor.canDrop(),
  dropHovered: monitor.isOver()
});

let fileDropListener;

class GridItem extends Component {
  static propTypes = {
    dropHighlighted: PropTypes.bool,
    dropHovered: PropTypes.bool,
    connectDropTarget: PropTypes.func.isRequired,
    item: PropTypes.object,
    handleItemClick: PropTypes.func,
    onLikeUnlikeClick: PropTypes.func,
    group: PropTypes.object,
    removeItem: PropTypes.func,
    onStarUnstarClick: PropTypes.func,
    archiveItem: PropTypes.func.isRequired,
    filterBySlug: PropTypes.func.isRequired,
  };

  state = {
    screen: SCREEN.ITEM,
    data: null,
    dropState: FileDropStore.getState(),
    isMainFormOpen: false,
    action: null
  };

  closeMainForm = () =>
    this.setState(state => ({ ...state, isMainFormOpen: false, action: null }));

  componentDidMount() {
    fileDropListener = FileDropStore.addListener(this.onDropChange);
  }

  componentWillUnmount() {
    if (fileDropListener) {
      fileDropListener.remove();
    }
  }

  componentWillReceiveProps({ dropHighlighted, dropHovered }) {
    this.setState(state => ({
      ...state,
      screen: dropHighlighted
        ? dropHovered ? SCREEN.DROP_MENU : SCREEN.ITEM
        : state.screen
    }));
  }

  switchScreen = (screen, data = null) =>
    this.setState(state => ({ ...state, screen, data }));

  onDropChange = () =>
    this.setState(state => ({
      ...state,
      dropState: FileDropStore.getState()
    }));

  handleOptionSelect = action => {
    this.setState(state => ({ ...state, isMainFormOpen: true, action }));
    this.props.filterBySlug(this.props.item.attributes.slug);
  };

  render() {
    const {
      props: {
        connectDropTarget,
        dropHighlighted,
        handleItemClick,
        archiveItem,
        onLikeUnlikeClick,
        group,
        removeItem,
        onStarUnstarClick,
        item
      },
      state: { screen, data, isMainFormOpen, action }
    } = this;

    if (!item.attributes) {
      return <div>Missing item attributes</div>;
    }

    let itemContent = null;
    const itemClass = classNames({
      'full-height': true,
      'drop-highlighted': dropHighlighted 
    });

    switch (screen) {
      case SCREEN.OPTIONS_MENU:
        itemContent = (
          <GridItemMenu
            item={item}
            switchScreen={this.switchScreen}
            removeItem={removeItem}
            archiveItem={archiveItem}
            handleOptionSelect={this.handleOptionSelect}
          />
        );
        break;

      case SCREEN.LABEL_LISTING:
        itemContent = (
          <ItemLabelsListing item={item} switchScreen={this.switchScreen} />
        );
        break;

      case SCREEN.LABEL_FORM:
        itemContent = (
          <ItemLabelsForm item={item} label={data} switchScreen={this.switchScreen} />
        );
        break;

      case SCREEN.DROP_MENU:
        itemContent = (
          <GridItemDropMenu item={item} switchScreen={this.switchScreen} />
        );
        break;

      default:
        itemContent = (
          <GridItemTip
            group={group}
            item={item}
            handleItemClick={handleItemClick}
            switchScreen={this.switchScreen}
            onLikeUnlikeClick={onLikeUnlikeClick}
            onStarUnstarClick={onStarUnstarClick}
          />
        );
        break;
    }

    return connectDropTarget(
      <div className={itemClass} id={'item-' + item.id}>
        {itemContent}
        {isMainFormOpen && (
          <MainFormPage
            cardFormOnly
            activeTab={action}
            onClose={this.closeMainForm}
          />
        )}
      </div>
    );
  }
}

const mapState = () => ({});

const mapDispatch = {
  filterBySlug: filterTipBySlug,
};

export default connect(mapState, mapDispatch)(
  DropTarget(ItemTypes.FILE_ITEM, gridItemTarget, collect)(GridItem)
);
