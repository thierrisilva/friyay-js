/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { head, lensPath, lensProp, compose, view, nth } from 'ramda';
import StringHelper from '../../../helpers/string_helper';
import ItemsList from './item_card_view/items_list';
import ItemContent from 'Components/pages/item_page/item_content';
import ItemContentEdit from 'Components/pages/item_page/item_content_edit';
import ItemContentImages from 'Components/pages/item_page/item_content_images';
import ItemPage from 'Components/pages/item_page';
import Ability from 'Lib/ability';
import tiphive from 'Lib/tiphive';
import {
  filterTipBySlug,
  resetTip,
  filterTipCardViewById,
  resetTipCardView
} from 'Actions/tipsFilter';
import { setEditHidden, setEditActive } from 'Actions/tipsModal';
import { minimizeTip } from 'Actions/minimizeBar';
import MainFormPage from 'Components/pages/MainFormPage';
import isEmpty from 'lodash/isEmpty';

const getSlug = view(lensPath(['attributes', 'slug']));
const getSlugFromFirst = compose(
  getSlug,
  head
);
const getSlugFromSecond = compose(
  getSlug,
  nth(2)
);
const getId = view(lensProp('id'));
const getIdFromFirst = compose(
  getId,
  head
);
const getIdFromSecond = compose(
  getId,
  nth(1)
);

class ItemsCardView extends Component {
  static propTypes = {
    group: PropTypes.object,
    showTopicFilterView: PropTypes.bool,
    items: PropTypes.array.isRequired,
    removeItem: PropTypes.func.isRequired,
    topic: PropTypes.object,
    handleNewTipClick: PropTypes.func.isRequired,
    onLikeUnlikeClick: PropTypes.func.isRequired,
    onStarUnstarClick: PropTypes.func.isRequired,
    loadingStatus: PropTypes.element,
    isEditing: PropTypes.bool,
    showEdit: PropTypes.func.isRequired,
    hideEdit: PropTypes.func.isRequired,
    filterBySlug: PropTypes.func.isRequired,
    archiveItem: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    cardViewTip: PropTypes.object,
    filterCardViewById: PropTypes.func.isRequired,
    resetCardView: PropTypes.func.isRequired,
    itemAddActive: PropTypes.bool,
    router: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    minimize: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    isHexGridVisible: PropTypes.bool
  };

  static defaultProps = {
    isEditing: false,
    cardViewTip: null,
    isLoading: false,
    isHexGridVisible: true
  };

  constructor(props) {
    super(props);

    this.state = {
      showCardList: !props.showTopicFilterView,
      autoSaveEditItem: false, //true,
      isItemPageOpen: false,
      isMainFormOpen: false,
      action: null,
      height: 0
    };
  }

  componentWillReceiveProps({
    showTopicFilterView,
    items,
    cardViewTip,
    itemAddActive,
    filterBySlug,
    filterCardViewById
  }) {
    const {
      props: { items: prevItems }
    } = this;
    if (showTopicFilterView === this.state.showCardList) {
      this.setState(state => ({
        ...state,
        showCardList: !showTopicFilterView
      }));
    }
    if (items.length > 0 && prevItems.length === 0) {
      if (cardViewTip !== null) {
        filterCardViewById(getId(cardViewTip));
        filterBySlug(getSlug(cardViewTip));
      } else {
        filterCardViewById(getIdFromFirst(items));
        filterBySlug(getSlugFromFirst(items));
      }
      this.setState(state => ({
        ...state,
        height: $(window).height(),
        itemAddActive
      }));
    }
  }

  componentWillMount() {
    const {
      props: {
        items,
        filterBySlug,
        filterCardViewById,
        cardViewTip,
        itemAddActive
      }
    } = this;
    if (items.length > 0) {
      if (cardViewTip !== null) {
        filterCardViewById(getId(cardViewTip));
        filterBySlug(getSlug(cardViewTip));
      } else {
        filterCardViewById(getIdFromFirst(items));
        filterBySlug(getSlugFromFirst(items));
      }
      this.setState(state => ({
        ...state,
        height: $(window).height(),
        itemAddActive
      }));
    }
  }

  handleItemClick = ({ attributes: { slug }, id }) => {
    const {
      props: { hideEdit, filterBySlug, filterCardViewById }
    } = this;
    filterCardViewById(id);
    filterBySlug(slug);
    hideEdit();
  };

  componentDidMount() {
    tiphive.addDetectElementScrollEnd(
      document.querySelector('.side-panel-container')
    );
  }

  hideLeftPane = () =>
    this.setState(state => ({ ...state, showCardList: false }));

  showLeftPane = () =>
    this.setState(state => ({ ...state, showCardList: true }));

  handleNewTipClick = () => {
    this.setState(state => ({ ...state, itemAddActive: true }));
  };

  handleItemEditClick = () => {
    this.setState({ autoSaveEditItem: true });
    this.props.showEdit();
  };

  handleMaximizeClick = () => {
    const {
      props: { cardViewTip, filterBySlug }
    } = this;
    const {
      attributes: { slug }
    } = cardViewTip;
    filterBySlug(slug);
    window.history.pushState(null, '', `/cards/${slug}`);
    this.setState(state => ({ ...state, isItemPageOpen: true }));
  };

  handleTopicClick = url => this.props.router.push(url);

  closeItemPage = () =>
    this.setState(state => ({ ...state, isItemPageOpen: false }));

  closeMainForm = () =>
    this.setState(state => ({ ...state, isMainFormOpen: false, action: null }));

  changeCurrentCard = tipId => {
    const {
      props: { items, filterBySlug, filterCardViewById, reset }
    } = this;
    const index = items.findIndex(({ id }) => id === tipId);

    if (items.length === 0) {
      reset();
    } else if (index === 0 && items.length > 1) {
      filterCardViewById(getIdFromSecond(items));
      filterBySlug(getSlugFromSecond(items));
    } else {
      filterCardViewById(getIdFromFirst(items));
      filterBySlug(getSlugFromFirst(items));
    }
  };

  // Two methods for archiving cards?
  handleItemArchiveClick = () => {
    const {
      props: {
        archiveItem,
        cardViewTip: { id }
      }
    } = this;

    vex.dialog.confirm({
      unsafeMessage: `
        Are you sure you want to Archive this Card?
        <br /><br />
        You can use the label filters in the Action Bar to your right to view archived Cards.
      `,
      callback: async value => {
        if (value) {
          archiveItem(id);
          this.changeCurrentCard(id);
        }
      }
    });
  };

  handleArchiveItem = item => {
    const {
      props: {
        archiveItem,
        cardViewTip: { id }
      }
    } = this;
    vex.dialog.confirm({
      unsafeMessage: `
        Are you sure you want to Archive this Card?
        <br /><br />
        You can use the label filters in the Action Bar to your right to view archived Cards.
      `,
      callback: async value => {
        if (value) {
          archiveItem(item.id);
          id === item.id && this.changeCurrentCard(id);
        }
      }
    });
  };

  // Two methods for deleting cards?
  handleItemTrashClick = () => {
    const {
      props: {
        removeItem,
        cardViewTip: { id }
      }
    } = this;

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this item?',
      callback: async value => {
        if (value) {
          await removeItem(id);
          this.changeCurrentCard(id);
        }
      }
    });
  };

  handleDeleteItem = item => {
    const {
      props: {
        removeItem,
        cardViewTip: { id }
      }
    } = this;

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this item?',
      callback: async value => {
        if (value) {
          await removeItem(item.id);
          id === item.id && this.changeCurrentCard(id);
        }
      }
    });
  };

  handleLikeClick = e => {
    e.preventDefault();
    const {
      state: {
        currentCard: {
          id,
          attributes: { liked_by_current_user }
        }
      },
      props: { onLikeUnlikeClick }
    } = this;

    onLikeUnlikeClick(id, liked_by_current_user);
  };

  handleStarClick = e => {
    e.preventDefault();
    const {
      state: {
        currentCard: {
          id,
          attributes: { starred_by_current_user }
        }
      },
      props: { onStarUnstarClick }
    } = this;

    onStarUnstarClick(id, starred_by_current_user);
  };

  onMinimize = () => {
    const {
      props: { isEditing, cardViewTip, minimize }
    } = this;

    cardViewTip !== null &&
      minimize({
        type: 'tips',
        id: cardViewTip.attributes.slug,
        title: cardViewTip.attributes.title,
        itemEditActive: isEditing
      });
  };

  closeCardViewEdit = (newTip = null) => {
    const {
      props: { filterCardViewById, filterBySlug },
      state: { itemAddActive }
    } = this;
    if (itemAddActive) {
      this.setState(state => ({ ...state, itemAddActive: false }));
    }

    if (newTip !== null) {
      filterCardViewById(newTip.id);
      filterBySlug(newTip.attributes.slug);
    }
  };

  updateAutoSaveEditItem = autoSaveEditItem =>
    this.setState(state => ({ ...state, autoSaveEditItem }));

  handleOptionClick = action => {
    const {
      props: {
        filterBySlug,
        cardViewTip: {
          attributes: { slug }
        }
      }
    } = this;
    filterBySlug(slug);
    this.setState(state => ({ ...state, action, isMainFormOpen: true }));
  };

  render() {
    const {
      props: {
        items,
        group,
        topic,
        loadingStatus,
        isEditing,
        cardViewTip,
        currentUser,
        isLoading,
        isHexGridVisible
      },
      state: {
        showCardList,
        height,
        autoSaveEditItem,
        isItemPageOpen,
        isMainFormOpen,
        action,
        itemAddActive
      }
    } = this;

    let itemContent = null;
    let imagesContent = null;
    let title = '';
    let body = '';
    const canCreate = topic !== null && Ability.can('create', 'tips', topic);

    if (cardViewTip !== null) {
      title = cardViewTip.attributes.title;
      body = cardViewTip.attributes.body;

      const attachments = cardViewTip.attributes.attachments_json || {};
      const images = attachments.images;

      if (images && images.length > 0) {
        imagesContent = (
          <div className="form-group">
            <ItemContentImages item={cardViewTip} images={images} />
          </div>
        );
      }

      let newCard = null;
      if (itemAddActive) {
        const relationships = topic !== null ? topic.attributes.path : [];

        newCard = {
          attributes: {
            creator: currentUser,
            updated_at: new Date(),
            attachments_json: {
              images: [],
              documents: []
            }
          },
          relationships: {
            topics: { data: relationships },
            subtopics: { data: [] },
            labels: { data: [] },
            share_settings: { data: [] }
          }
        };
      }

      if (isEditing || itemAddActive) {
        itemContent = (
          <ItemContentEdit
            tip={itemAddActive ? newCard : cardViewTip}
            showActions
            removeStyle
            cardView
            autoSave={autoSaveEditItem}
            updateAutoSave={this.updateAutoSaveEditItem}
            handleItemTrashClick={this.handleItemTrashClick}
            handleItemArchiveClick={this.handleItemArchiveClick}
            handleMaximizeClick={this.handleMaximizeClick}
            handleOptionClick={this.handleOptionClick}
            itemAddActive={itemAddActive}
            closeCardViewEdit={this.closeCardViewEdit}
          />
        );
      } else {
        itemContent = (
          <ItemContent
            tip={cardViewTip}
            handleItemEditClick={this.handleItemEditClick}
            handleItemTrashClick={this.handleItemTrashClick}
            handleLikeClick={this.handleLikeClick}
            handleBodyClick={this.handleItemEditClick}
            cardView
            onMinimize={this.onMinimize}
            handleStarClick={this.handleStarClick}
            handleItemArchiveClick={this.handleItemArchiveClick}
            handleMaximizeClick={this.handleMaximizeClick}
            handleOptionClick={this.handleOptionClick}
          />
        );
      }
    } else {
      if (isLoading) {
        itemContent = loadingStatus;
      } else {
        const relationships = topic !== null ? topic.attributes.path : [];

        const newCard = {
          attributes: {
            creator: currentUser,
            updated_at: new Date(),
            attachments_json: {
              images: [],
              documents: []
            }
          },
          relationships: {
            topics: { data: relationships },
            subtopics: { data: [] },
            labels: { data: [] },
            share_settings: { data: [] }
          }
        };

        itemContent = (
          <ItemContentEdit
            tip={newCard}
            showActions
            removeStyle
            cardView
            itemAddActive
            autoSave={autoSaveEditItem}
            openToAddTopic={this.openToAddTopic}
            updateAutoSave={this.updateAutoSaveEditItem}
            handleItemTrashClick={this.handleItemTrashClick}
            handleItemArchiveClick={this.handleItemArchiveClick}
            handleMaximizeClick={this.handleMaximizeClick}
            handleOptionClick={this.handleOptionClick}
            closeCardViewEdit={this.closeCardViewEdit}
          />
        );
      }
    }

    const sidePanelClass = classNames({
      'col-md-4 list-view side-panel': true,
      hide: !showCardList
    });

    const mainPanelClass = classNames({
      'col-md-8 main-panel': showCardList,
      'col-md-12 main-panel list-hidden': !showCardList
    });

    let panelStyle = {};

    if (isLoading && cardViewTip === null) {
      panelStyle = {
        backgroundColor: 'transparent',
        paddingRight: 50,
        marginTop: 15
      };
    }

    let viewStyle = {};

    if (!isHexGridVisible) {
      viewStyle = {
        border: '0 none'
      };
    }

    return (
      <div className="card-view row" style={viewStyle}>
        <ItemsList
          handleNewTipClick={this.handleNewTipClick}
          showCardList={showCardList}
          sidePanelClass={sidePanelClass}
          items={items}
          currentCard={cardViewTip}
          group={group}
          handleItemClick={this.handleItemClick}
          hideLeftPane={this.hideLeftPane}
          height={height}
          removeItem={this.handleDeleteItem}
          archiveItem={this.handleArchiveItem}
          canCreate={canCreate}
          loadingStatus={loadingStatus}
          itemAddActive={itemAddActive}
        />
        <div className={mainPanelClass}>
          {!showCardList && (
            <a className="show-side-btn pull-left" onClick={this.showLeftPane}>
              <i className="glyphicon glyphicon-menu-right" />
            </a>
          )}
          <div
            className={classNames({
              'item-content-container': itemContent !== null
            })}
            style={panelStyle}
          >
            {itemContent}
          </div>
        </div>
        <div id="item-page-section-to-print">
          <h1 className="item-title" id="js-item-title">
            {title}
          </h1>

          <div
            className="item-text"
            id="js-item-text"
            dangerouslySetInnerHTML={{
              __html: StringHelper.simpleFormat(body || '')
            }}
          />
          {imagesContent}
        </div>
        <div className="clearfix" />
        {isItemPageOpen && (
          <ItemPage
            group={group}
            editActive
            editActiveFromCardForm
            onClose={this.closeItemPage}
          />
        )}
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

const mapState = ({
  labelsFilter,
  tipsModal: { isEditing },
  tips: { collection },
  cardViewFilter,
  appUser: { user },
  tipsView: { isHexGridVisible }
}) => ({
  isHexGridVisible,
  isEditing,
  cardViewTip:
    collection
      .filter(
        ({
          attributes: { is_disabled },
          relationships: {
            labels: { data: labels }
          }
        }) => {
          if (isEmpty(labelsFilter)) {
            return !is_disabled;
          } else {
            return labels.some(label =>
              labelsFilter.includes(toString(label.id))
            );
          }
        }
      )
      .find(cardViewFilter) || null,
  currentUser: user
});

const mapProps = {
  hideEdit: setEditHidden,
  showEdit: setEditActive,
  filterBySlug: filterTipBySlug,
  reset: resetTip,
  filterCardViewById: filterTipCardViewById,
  resetCardView: resetTipCardView,
  minimize: minimizeTip
};

export default connect(
  mapState,
  mapProps
)(withRouter(ItemsCardView));
