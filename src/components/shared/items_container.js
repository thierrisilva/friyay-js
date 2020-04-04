import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import GridPlaceholderItem from './items_container/grid_placeholder_item';
import ItemPage from '../pages/item_page';
import MainFormPage from '../pages/MainFormPage';
import AddTipPlaceholderItem from './items_container/add_tip_placeholder_item';
import ItemsTopBar from './items_container/items_top_bar';
import Item from './items_container/item';
import Loader from 'Components/shared/Loader';
import ItemsCardView from './items_container/items_card_view';
import analytics from 'Lib/analytics';
import Ability from 'Lib/ability';
import tiphive from 'Lib/tiphive';
import {
  starTip,
  unstarTip,
  likeTip,
  unlikeTip,
  removeTip,
  archiveTip
} from 'Actions/tips';

import { VIEWS_ENUM as VIEWS } from 'Enums';
import { filterTipBySlug, resetTip } from 'Actions/tipsFilter';
import { compose, slice, map, prop } from 'ramda';

const getPrecedingIds = index =>
  compose(
    map(prop('id')),
    slice(0, index)
  );

class ItemsContainer extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    topic: PropTypes.object,
    group: PropTypes.object,
    userId: PropTypes.string,
    items: PropTypes.array,
    hideTipFilter: PropTypes.bool,
    showTopicFilterView: PropTypes.bool,
    itemAddActive: PropTypes.bool,
    handleStarUnstarClick: PropTypes.func,
    handleLikeUnlikeClick: PropTypes.func,

    filterBySlug: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    star: PropTypes.func.isRequired,
    unstar: PropTypes.func.isRequired,
    like: PropTypes.func.isRequired,
    unlike: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    archive: PropTypes.func.isRequired,
    view: PropTypes.number,
    moveDraggingTip: PropTypes.func,
    location: PropTypes.object.isRequired,
    currentLocation: PropTypes.string,
    currentUserId: PropTypes.string.isRequired,
    dropDraggingTip: PropTypes.func,
    topicView: PropTypes.number
  };

  static defaultProps = {
    isLoading: false,
    items: [],
    hideTipFilter: false,
    view: VIEWS.GRID,
    topicView: null,
    topic: null
  };

  state = {
    isItemPageOpen: false,
    isMainFormOpen: false,
    slug: null
  };

  componentDidMount() {
    tiphive.addDetectElementScrollEnd(window);
  }

  componentWillUnmount() {
    tiphive.removeDetectElementScrollEnd(window);

    cancelAnimationFrame(this.requestedFrame);
  }

  componentWillReceiveProps({ view }) {
    if (view !== VIEWS.CARD) {
      tiphive.addDetectElementScrollEnd(window);
    } else {
      tiphive.removeDetectElementScrollEnd(window);
    }
  }

  onItemPageClose = () => {
    this.props.reset();
    this.setState(state => ({ ...state, isItemPageOpen: false, slug: null }));
  };

  onMainFormClose = () => {
    this.props.reset();
    this.setState(state => ({ ...state, isMainFormOpen: false }));
  };

  handleItemClick = ({ attributes: { slug } }) => {
    this.props.filterBySlug(slug);
    this.setState(state => ({ ...state, isItemPageOpen: true, slug }));
    history.pushState(null, '', `/cards/${slug}`);
  };

  onLikeUnlikeClick = (id, isLiked = false) => {
    const {
      props: { like, unlike, handleLikeUnlikeClick }
    } = this;
    handleLikeUnlikeClick
      ? handleLikeUnlikeClick(id, isLiked)
      : isLiked
      ? unlike(id)
      : like(id);
  };

  onStarUnstarClick = (id, isStarred = false) => {
    const {
      props: { star, unstar, handleStarUnstarClick }
    } = this;
    handleStarUnstarClick
      ? handleStarUnstarClick(id, isStarred)
      : isStarred
      ? unstar(id)
      : star(id);
  };

  handleNewTipClick = e => {
    e.preventDefault();
    this.props.reset();
    this.setState(state => ({ ...state, isMainFormOpen: true }));
    analytics.track('Add Card Clicked');
  };

  moveItem = (dragIndex, hoverIndex, { item, topic }) => {
    const { moveDraggingTip } = this.props;

    if (moveDraggingTip) {
      moveDraggingTip(dragIndex, hoverIndex, item, topic);
    }
  };

  dropItem = (item, dragIndex, toTopic, fromTopic) => {
    const { items, dropDraggingTip } = this.props;
    const precedingTipIds = getPrecedingIds(dragIndex)(items);

    if (dropDraggingTip) {
      dropDraggingTip(item, dragIndex, precedingTipIds, toTopic, fromTopic);
    }
  };

  renderItems() {
    const {
      props: {
        currentUserId,
        group,
        topic,
        hideTipFilter,
        items,
        remove,
        archive,
        view,
        topicView,
        userId,
        location: {
          query: { justCreated }
        },
        isLoading
      }
    } = this;

    const tipView =
      topicView !== null && topic !== null
        ? topicView
        : view !== null
        ? view
        : VIEWS.GRID;

    let itemsContent = items.map((item, index) => (
      <Item
        tipViewMode={tipView}
        location={location}
        group={group}
        item={item}
        key={`item-${item.id}`}
        data-id={item.id}
        data-type={item.type}
        id={item.id}
        index={index}
        topic={topic}
        handleItemClick={this.handleItemClick}
        removeItem={remove}
        archiveItem={archive}
        onLikeUnlikeClick={this.onLikeUnlikeClick}
        onStarUnstarClick={this.onStarUnstarClick}
        moveItem={this.moveItem}
        dropItem={this.dropItem}
      />
    ));

    if (justCreated) {
      itemsContent = [
        ...itemsContent,
        <GridPlaceholderItem
          tipViewMode={tipView}
          key="grid-placeholder-item"
        />
      ];
    }

    if (topic && Ability.can('create', 'tips', topic) && !hideTipFilter) {
      itemsContent = [
        ...itemsContent,
        <AddTipPlaceholderItem
          tipViewMode={tipView}
          key="add-item-placeholder-item"
          handleNewTipClick={this.handleNewTipClick}
        />
      ];
    } else if ((!topic && !userId) || userId === currentUserId) {
      itemsContent = [
        ...itemsContent,
        <AddTipPlaceholderItem
          tipViewMode={tipView}
          key="add-item-placeholder-item"
          handleNewTipClick={this.handleNewTipClick}
        />,
        ...(tipView === VIEWS.CARD && isLoading
          ? [
              <div className="text-center mt10" key="loading">
                <Loader />
              </div>
            ]
          : [])
      ];
    }

    const itemContainerClassNames = classNames({
      'items-container': true,
      'list-view': tipView === VIEWS.LIST,
      'small-grid-view': tipView === VIEWS.SMALL_GRID,
      'card-view': tipView === VIEWS.CARD,
      'item-empty': items.length === 0
    });

    // add 10 empty grid for handling flexbox wrap alignment
    if (
      items.length > 0 &&
      (tipView === VIEWS.SMALL_GRID || tipView === VIEWS.GRID)
    ) {
      const emptyClass = classNames({
        'small-grid-item': tipView === VIEWS.SMALL_GRID,
        'grid-item': tipView === VIEWS.GRID
      });

      itemsContent = [
        ...itemsContent,
        ...Array(10)
          .fill(0)
          .map((_, index) => (
            <div className={emptyClass} key={`empty-${index}`} />
          ))
      ];
    }

    return <div className={itemContainerClassNames}>{itemsContent}</div>;
  }

  render() {
    const {
      props: {
        group,
        topic,
        isLoading,
        userId,
        hideTipFilter,
        showTopicFilterView,
        items,
        remove,
        archive,
        view,
        itemAddActive,
        currentLocation,
        currentUserId,
        topicView
      },
      state: { isMainFormOpen, isItemPageOpen, slug }
    } = this;

    const tipsView = topic !== null && topicView !== null ? topicView : view;

    let itemsMessage = null;
    if (isLoading === true) {
      itemsMessage = (
        <p className="text-center">
          <Loader />
        </p>
      );
    } else if (isLoading === false && items.length === 0 && !hideTipFilter) {
      const {
        history: { state }
      } = window;

      // if filter is present, show a different message
      if (state && (state.filter_type || state.filter_labels)) {
        itemsMessage = (
          <div className="pb10">
            <p className="text-center">No Cards match your filters.</p>
          </div>
        );
      }

      if (currentLocation === 'users' && userId !== currentUserId) {
        itemsMessage = (
          <p className="text-center">User has not added any cards yet.</p>
        );
      }
    }

    let itemsTopBarContent = null;
    if (!hideTipFilter && tipsView !== VIEWS.CARD) {
      itemsTopBarContent = (
        <ItemsTopBar
          group={group}
          topic={topic}
          userId={userId}
          handleNewTipClick={this.handleNewTipClick}
        />
      );
    }

    let itemsPanel = null;
    if (tipsView === VIEWS.CARD) {
      itemsPanel = (
        <ItemsCardView
          items={items}
          showTopicFilterView={showTopicFilterView}
          handleNewTipClick={this.handleNewTipClick}
          handleItemClick={this.handleItemClick}
          group={group}
          topic={topic}
          removeItem={remove}
          archiveItem={archive}
          isLoading={isLoading}
          loadingStatus={itemsMessage}
          onLikeUnlikeClick={this.onLikeUnlikeClick}
          onStarUnstarClick={this.onStarUnstarClick}
          itemAddActive={itemAddActive}
        />
      );
    } else {
      itemsPanel = this.renderItems();
    }

    return (
      <div className="item-container-parent">
        {itemsTopBarContent}
        {itemsPanel}
        {tipsView !== VIEWS.CARD && itemsMessage}
        {isItemPageOpen && (
          <ItemPage group={group} onClose={this.onItemPageClose} slug={slug} />
        )}
        {isMainFormOpen && (
          <MainFormPage
            group={group}
            topic={topic}
            cardFormOnly
            onClose={this.onMainFormClose}
          />
        )}
      </div>
    );
  }
}

const mapState = ({
  tips: { isLoading },
  tipsView: { view, isPanelVisible },
  location: { currentModule },
  appUser: { id }
}) => ({
  isLoading,
  view,
  isPanelVisible,
  currentLocation: currentModule,
  currentUserId: id
});

const mapDispatch = {
  filterBySlug: filterTipBySlug,
  reset: resetTip,
  star: starTip,
  unstar: unstarTip,
  like: likeTip,
  unlike: unlikeTip,
  remove: removeTip,
  archive: archiveTip
};

export default connect(
  mapState,
  mapDispatch
)(withRouter(ItemsContainer));
