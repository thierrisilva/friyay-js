/* global vex */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ItemContent from './item_page/item_content';
import ItemContentEdit from './item_page/item_content_edit';
import PageModal from './page_modal';
import ItemLeftPane from './item_page/item_left_pane';
import ItemRightPane from './item_page/item_right_pane';
import analytics from 'Lib/analytics';
import tiphive from 'Lib/tiphive';
import Ability from 'Lib/ability';
import ItemContentImages from './item_page/item_content_images';
import StringHelper from '../../helpers/string_helper';
import Loader from '../shared/Loader';
import IconBtn from '../shared/icon_btn';
import { withRouter } from 'react-router';
import MainFormPage from './main_form_page';
import { minimizeTip } from 'Actions/minimizeBar';
import { getTipBySlug, removeTip, archiveTip, flushTip } from 'Actions/tips';
import { resetTip, filterTipBySlug } from 'Actions/tipsFilter';
import { setEditHidden, setEditActive, toggleRelated } from 'Actions/tipsModal';

class ItemPage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    tip: PropTypes.object,
    getTip: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isVisible: PropTypes.bool.isRequired,
    isRelated: PropTypes.bool.isRequired,
    hideEdit: PropTypes.func.isRequired,
    showEdit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    anim: PropTypes.string,
    toggle: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    archive: PropTypes.func.isRequired,
    group: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    filterBySlug: PropTypes.func.isRequired,
    minimize: PropTypes.func.isRequired,
    currentModule: PropTypes.string,
    lastModule: PropTypes.string,
    currentFilter: PropTypes.string,
    labelsFilter: PropTypes.arrayOf(PropTypes.string),
    slug: PropTypes.string,
    flush: PropTypes.func.isRequired,
    isMainFormOpen: PropTypes.bool
  };

  static defaultProps = {
    tip: null,
    isEditing: false,
    isVisible: false,
    isRelated: false,
    isLoading: false,
    slug: null
  };

  hasError = false;
  title_update = '';

  state = {
    editActiveFromCardForm: false,
    isItemPageOpen: true,
    isMainFormOpen: false,
    action: null
  };

  closeItemPage = () => {
    this.setState(state => ({ ...state, isItemPageOpen: false }));
    this.props.hideEdit();
    !this.state.isMainFormOpen && this.props.onClose();
  };

  closeMainForm = () => {
    const {
      props: { reset, onClose, isMainFormOpen: propsOpen },
      state: { isMainFormOpen: stateOpen }
    } = this;

    if (propsOpen) {
      onClose();
    } else if (stateOpen) {
      this.setState(state => ({
        ...state,
        isMainFormOpen: false,
        action: null
      }));
    } else {
      reset();
      onClose();
    }
  };

  async componentDidMount() {
    const {
      props: {
        location: { pathname, search = '' },
        tip,
        getTip,
        isEditing,
        hideEdit,
        slug
      }
    } = this;

    let item = tip;

    if (item === null) {
      try {
        if (slug !== null) {
          item = await getTip(slug);
        } else {
          const [extracted] = pathname.split('/').reverse();
          item = await getTip(extracted);
        }
        // TODO: add select id;
      } catch (e) {
        console.error(e);
        this.hasError = true;
        return tiphive.hideAllModals();
      }
    }

    if (item === null) {
      this.hasError = true;
      return tiphive.hideAllModals();
    }

    const {
      id,
      attributes: { title }
    } = item;
    analytics.track('Card Visited', { id, title });

    if (
      (isEditing || search.includes('edit=true')) &&
      Ability.cannot('update', 'self', item)
    ) {
      hideEdit();
    }
  }

  componentWillUnmount() {
    const {
      props: { tip, location, router, reset, currentModule, flush },
      state: { isMainFormOpen, isItemPageOpen }
    } = this;

    if (tip === null) {
      // If null, was deleted or archived
      if (this.hasError) {
        router.push('/');
      } else {
        history.pushState(null, '', location.pathname);
      }
      !isMainFormOpen && !isItemPageOpen && flush();
      !isMainFormOpen && !isItemPageOpen && reset();
    } else {
      const {
        attributes: { slug }
      } = tip;
      const tipsPath = `/cards/${slug}`;
      const routerLocation = router.getCurrentLocation();
      if (currentModule === 'tips') {
        router.push('/');
        !isMainFormOpen && !isItemPageOpen && flush();
        !isMainFormOpen && !isItemPageOpen && reset();
      } else if (routerLocation.pathname !== tipsPath) {
        history.pushState(null, '', routerLocation.pathname);
        !isMainFormOpen && !isItemPageOpen && flush();
        !isMainFormOpen && !isItemPageOpen && reset();
      } else {
        router.push(location.pathname);
        !isMainFormOpen && !isItemPageOpen && flush();
        !isMainFormOpen && !isItemPageOpen && reset();
      }
    }
  }

  enableUpdateForm = () =>
    this.setState(state => ({
      ...state,
      editActiveFromCardForm: false
    }));

  onSave = ({ attributes: { slug } }) => {
    this.props.filterBySlug(slug);
    window.history.pushState(null, '', `/cards/${slug}`);
  };

  handleItemTrashClick = e => {
    e.preventDefault();

    vex.dialog.confirm({
      message: 'Are you sure you want to delete this item?',
      callback: async value => {
        const {
          props: {
            tip,
            remove,
            router,
            location: { pathname },
            hideEdit
          }
        } = this;
        if (value && tip) {
          await remove(tip.id);
          hideEdit();
          tiphive.hideAllModals();
          router.push(pathname);
        }
      }
    });
  };

  handleItemArchiveClick = () => {
    vex.dialog.confirm({
      unsafeMessage: `
        Are you sure you want to Archive this Card?
        <br /><br />
        You can use the label filters in the Action Bar to your right to view archived Cards.
      `,
      callback: async value => {
        const {
          props: {
            tip,
            archive,
            router,
            location: { pathname }
          }
        } = this;
        if (value && tip) {
          await archive(tip.id);
          tiphive.hideAllModals();
          router.push(pathname);
        }
      }
    });
  };

  handleOptionClick = action =>
    this.setState(state => ({
      ...state,
      action,
      isMainFormOpen: true
    }));

  handleRelatedItemClick = (id, title, slug) => {
    this.props.filterBySlug(slug);
    window.history.pushState('', '', `/cards/${slug}`);
    analytics.track('Card Visited', { id, title });
  };

  onMinimize = value => {
    // console.log('PASSING VALUE IS ' , this.props);
    const {
      props: { tip, isEditing, minimize }
    } = this;
    let slug,
      title = '';
    if (this.title_update != '') {
      let updated_slug = this.title_update
        .toString()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        .toLowerCase();
      slug = tip.id + '-' + updated_slug;
      title = this.title_update;
    } else {
      slug = tip.attributes.slug;
      title = tip.attributes.title;
    }
    tip !== null &&
      minimize({
        type: 'tips',
        id: slug,
        title: title,
        itemEditActive: isEditing
      });
  };

  onUpdateTitle = value => {
    this.title_update = value;
  };
  onTopicClick = url => {
    const $primaryModal = $('#primary-modal');
    $primaryModal.modal('hide');
    $primaryModal.on('hidden.bs.modal', () => {
      this.props.router.push(url);
    });
  };

  onAvatarClick = () => $('#primary-modal').modal('hide');

  render() {
    const {
      props: { anim, tip, isRelated, isLoading, isEditing, toggle },
      state: { isMainFormOpen, isItemPageOpen, action }
    } = this;

    let imagesContent = null;
    let itemContent = null;
    let title = null;
    let body = '';
    let leftPane = (
      <IconBtn handleClick={toggle} materialIcon="chevron_right" />
    );

    if (isRelated) {
      leftPane = (
        <ItemLeftPane handleRelatedItemClick={this.handleRelatedItemClick} />
      );
    }

    if (isLoading || tip === null) {
      itemContent = (
        <p className="text-center mt20">
          <Loader isLoading />
        </p>
      );
    } else {
      const attributes = tip.attributes || {};
      const attachments = attributes.attachments_json || {};
      const images = attachments.images || [];
      title = attributes.title;
      body = attributes.body;

      if (images.length > 0) {
        imagesContent = (
          <div className="form-group">
            <ItemContentImages item={tip} images={images} />
          </div>
        );
      }

      if (isEditing) {
        itemContent = (
          <ItemContentEdit
            tip={tip}
            onTopicClick={this.onTopicClick}
            handleOptionClick={this.handleOptionClick}
            handleItemTrashClick={this.handleItemTrashClick}
            handleItemArchiveClick={this.handleItemArchiveClick}
            enableUpdateForm={this.enableUpdateForm}
            autoSave={false}
            onSave={this.onSave}
            onUpdateTitle={this.onUpdateTitle}
          />
        );
      } else {
        itemContent = (
          <ItemContent
            tip={tip}
            onTopicClick={this.onTopicClick}
            onAvatarClick={this.onAvatarClick}
            handleOptionClick={this.handleOptionClick}
            handleItemTrashClick={this.handleItemTrashClick}
            handleItemArchiveClick={this.handleItemArchiveClick}
          />
        );
      }
    }

    return (
      <div>
        {isItemPageOpen && (
          <div>
            <PageModal anim={anim} onClose={this.closeItemPage}>
              <div className="row tip-page">
                <div className="col-sm-3 tip-page-side">{leftPane}</div>
                <div className="col-sm-7 tip-page-content">{itemContent}</div>
                <div className="col-sm-2">
                  <ItemRightPane onMinimize={this.onMinimize} />
                </div>
              </div>
            </PageModal>
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
          </div>
        )}
        {isMainFormOpen && (
          <MainFormPage
            cardFormOnly
            activeTab={action}
            onClose={this.closeMainForm}
            isItemPageOpen={isItemPageOpen}
          />
        )}
      </div>
    );
  }
}

const mapState = ({
  tips,
  relatedTips,
  tipsFilter,
  tipsModal: { isVisible, isEditing, isRelated },
  location: { currentModule, lastModule },
  rightBarFilter: { currentFilter },
  labelsFilter
}) => ({
  tip:
    tips.collection.find(tipsFilter) ||
    relatedTips.collection.find(tipsFilter) ||
    tips.tipBySlug,
  isLoading: tips.isLoading,
  isVisible,
  isEditing,
  isRelated,
  currentModule,
  lastModule,
  currentFilter,
  labelsFilter
});

const mapDispatch = {
  getTip: getTipBySlug,
  hideEdit: setEditHidden,
  showEdit: setEditActive,
  toggle: toggleRelated,
  remove: removeTip,
  archive: archiveTip,
  reset: resetTip,
  filterBySlug: filterTipBySlug,
  minimize: minimizeTip,
  flush: flushTip
};

export default connect(
  mapState,
  mapDispatch
)(withRouter(ItemPage));
