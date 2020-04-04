import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MainFormActions from 'Actions/main_form_actions';
import MainFormStore from '../../stores/main_form_store';
import PageModal from './page_modal';
import TipTabContent from './main_form_page/tip_tab_content';
import TopicTabContent from './main_form_page/topic_tab_content';
import GroupTabContent from './main_form_page/group_tab_content';
import ItemPage from './item_page';
import tiphive from 'Lib/tiphive';
import { failure } from 'Utils/toast';
import isEmpty from 'lodash/isEmpty';
import { filterTipBySlug, resetTip } from 'Actions/tipsFilter';
import { createGroup } from 'Actions/groups';
import { filterGroupBySlug } from 'Actions/groupFilter';
import { minimizeTip } from 'Actions/minimizeBar';
import { clearMainTipContent } from 'Actions/autoSave';

class MainFormPage extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    topic: PropTypes.object,
    group: PropTypes.object,
    cardFormOnly: PropTypes.bool,
    updateTip: PropTypes.object,
    isItemPageOpen: PropTypes.bool,

    tip: PropTypes.object,
    activeTab: PropTypes.string,
    selectedTab: PropTypes.string,
    filterBySlug: PropTypes.func.isRequired,
    dropMethod: PropTypes.any, // TODO: fill this
    dropFile: PropTypes.any, // TODO: fill this
    onClose: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    minimize: PropTypes.func.isRequired,
    filterGroup: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    clearContent: PropTypes.func.isRequired,
    groups: PropTypes.array,
    domain: PropTypes.object
  };

  static defaultProps = {
    selectedTab: null
  };

  state = {
    tipFormData: {},
    topicFormData: {},
    groupFormData: {},
    isItemPageOpen: false,
    isMainFormOpen: true
  };

  closeItemPage = () => {
    this.setState(state => ({ ...state, isItemPageOpen: false }));
    !this.state.isMainFormOpen && this.props.reset();
    !this.state.isMainFormOpen && this.props.onClose();
  };

  closeMainForm = () => {
    const {
      props: { reset, onClose, isItemPageOpen: propsOpen },
      state: { isItemPageOpen: stateOpen }
    } = this;

    if (propsOpen) {
      onClose();
    } else if (stateOpen) {
      this.setState(state => ({ ...state, isMainFormOpen: false }));
    } else {
      reset();
      onClose();
    }
  };

  componentDidMount() {
    MainFormStore.addEventListener(
      window.TOPIC_CREATE_EVENT,
      this.onFormChange
    );
    const {
      props: { selectedTab }
    } = this;
    selectedTab !== null &&
      $(`#main-form-tabs a[href="#${selectedTab}"]`).tab('show');
  }

  componentWillUnmount() {
    MainFormStore.removeEventListener(
      window.TOPIC_CREATE_EVENT,
      this.onFormChange
    );
  }

  handleTopicFormBack = e => {
    e.preventDefault();
    $('#carousel-topic-form').carousel('prev');
  };

  handleTopicFormNext = e => {
    e.preventDefault();
    $('#carousel-topic-form').carousel('next');
  };

  handleTopicFormSubmit = e => {
    e.preventDefault();

    const topicTitle = $('#main-topic-form #topic_title')
      .val()
      .trim();
    const topicDescription = $('#main-topic-form #topic_description')
      .val()
      .trim();
    const sharingItemIDs = $('#main-topic-form #topic_sharing_item_ids').val();
    const permissionId = $('#main-topic-form .permissions-topic').data(
      'permission-id'
    );

    let adminUserIds = $('#main-topic-form #admin_sharing_item_ids').val();
    let topicPermissionsData = null;

    const accessHash = [
      ...document.querySelectorAll('select[name^="topic-permissions"]')
    ].reduce((next, sum) => {
      const $el = $(next);
      const action = $el.data('action');
      const permissionValue = $el.val();

      sum[action] = {
        roles: permissionValue || {}
      };

      return sum;
    }, {});

    if (window.isSubdomain === false) {
      adminUserIds = null;
      topicPermissionsData = null;
    } else {
      topicPermissionsData = {
        data: { id: permissionId, access_hash: accessHash }
      };
    }

    MainFormActions.createTopic(
      topicTitle,
      topicDescription,
      sharingItemIDs,
      adminUserIds,
      topicPermissionsData,
      this.props.domain
    );
  };

  onTopicSlide = ({ direction, relatedTarget }) => {
    const $target = $(relatedTarget);
    const slideIndex = $target
      .parent()
      .find('.item')
      .index($target);
    const topicTitle = $('#main-topic-form #topic_title')
      .val()
      .trim();

    if (direction === 'left' && slideIndex === 1 && isEmpty(topicTitle)) {
      failure('Please enter yay title');
      return false;
    }
  };

  handleGroupFormBack = e => {
    e.preventDefault();
    $('#carousel-group-form').carousel('prev');
  };

  handleGroupFormNext = e => {
    e.preventDefault();
    $('#carousel-group-form').carousel('next');
  };

  handleGroupFormSubmit = async e => {
    e.preventDefault();

    const title = $('#main-group-form #group_title')
      .val()
      .trim();
    const description = '';
    const userIds = $('#main-group-form #group_sharing_item_ids').val();

    const {
      props: { add, history, filterGroup, domain }
    } = this;

    const reRouteUrl = await add({ title, description, userIds, domain });

    tiphive.hideSecondaryModal();

    if (reRouteUrl !== null) {
      history.push(`/groups/${reRouteUrl}`);
      filterGroup(reRouteUrl);
    }
  };

  onGroupSlide = ({ direction, relatedTarget }) => {
    const $target = $(relatedTarget);
    const slideIndex = $target
      .parent()
      .find('.item')
      .index($target);
    const groupTitle = $('#main-group-form #group_title')
      .val()
      .trim();

    if (direction === 'left' && slideIndex === 1 && isEmpty(groupTitle)) {
      failure('Please enter Team title');
      return false;
    }
  };

  onFormChange = () => {
    tiphive.hideSecondaryModal();
    this.props.clearContent();
  };

  getMainFormPage() {
    const {
      props: {
        dropMethod,
        dropFile,
        activeTab,
        group,
        topic,
        groups,
        match: {
          params: { group_id = null }
        }
      }
    } = this;

    let selectedGroup = group;

    if (!selectedGroup) {
      selectedGroup = groups.find(grp => grp.attributes.slug === group_id);
    }

    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <a
              className="btn btn-link btn-close-side-left"
              data-dismiss="modal"
            >
              <i className="material-icons">clear</i>
            </a>

            <ul className="nav navbar-nav" role="tablist" id="main-form-tabs">
              <li role="presentation" className="active">
                <a
                  href="#tip-pane"
                  aria-controls="home"
                  role="tab"
                  data-toggle="tab"
                >
                  ADD CARD
                </a>
              </li>

              {!tiphive.userIsGuest() && (
                <li role="presentation">
                  <a
                    href="#topic-pane"
                    aria-controls="home"
                    role="tab"
                    data-toggle="tab"
                  >
                    ADD YAY
                  </a>
                </li>
              )}

              {!tiphive.userIsGuest() && (
                <li role="presentation">
                  <a
                    href="#group-pane"
                    aria-controls="home"
                    role="tab"
                    data-toggle="tab"
                  >
                    ADD TEAM
                  </a>
                </li>
              )}
            </ul>
          </div>
        </nav>

        <div className="tab-content" id="main-form-tab-content">
          <TipTabContent
            activeTab={activeTab}
            dropMethod={dropMethod}
            dropFile={dropFile}
            group={selectedGroup}
            domain={this.props.domain}
          />
          {!tiphive.userIsGuest() && (
            <TopicTabContent
              handleTopicFormBack={this.handleTopicFormBack}
              handleTopicFormNext={this.handleTopicFormNext}
              onTopicSlide={this.onTopicSlide}
              handleTopicFormSubmit={this.handleTopicFormSubmit}
              group={selectedGroup}
              topic={topic}
            />
          )}
          {!tiphive.userIsGuest() && (
            <GroupTabContent
              handleGroupFormBack={this.handleGroupFormBack}
              handleGroupFormNext={this.handleGroupFormNext}
              onGroupSlide={this.onGroupSlide}
              handleGroupFormSubmit={this.handleGroupFormSubmit}
            />
          )}
        </div>
      </div>
    );
  }

  handleMinimize = () => {
    const {
      props: { tip, minimize },
      state: { itemEditActive }
    } = this;

    if (tip) {
      minimize({
        type: tip.type,
        id: tip.attributes.slug,
        title: tip.attributes.title,
        itemEditActive: itemEditActive
      });

      tiphive.hideSecondaryModal();
      history.pushState(null, '', '');
    }
  };

  handleMaximize = () => {
    this.setState(
      state => ({ ...state, isItemPageOpen: true }),
      () => tiphive.hideSecondaryModal()
    );
    const {
      props: {
        tip: {
          attributes: { slug }
        },
        filterBySlug
      }
    } = this;
    filterBySlug(slug);
    history.pushState(null, '', `/cards/${slug}`);
  };

  getCardForm() {
    const {
      props: {
        dropMethod,
        dropFile,
        tip,
        updateTip,
        activeTab,
        group,
        topic,
        groups,
        match: {
          params: { group_id = null }
        }
      }
    } = this;

    let selectedGroup = group;

    if (!selectedGroup) {
      selectedGroup = groups.find(grp => grp.attributes.slug === group_id);
    }

    const newTip = updateTip || tip;
    const hasId = newTip !== null && newTip.id;

    return (
      <div className="tab-content card-form-content" id="main-form-tab-content">
        <div className="card-form-close-actions flex-r-center-end">
          {hasId && (
            <a className="btn-minimize" onClick={this.handleMinimize} />
          )}
          {hasId && (
            <a
              className="btn-external-link flex-r"
              onClick={this.handleMaximize}
            >
              <i className="material-icons">launch</i>
            </a>
          )}
          <a className="btn-close" data-dismiss="modal">
            <i className="material-icons">clear</i>
          </a>
        </div>
        <TipTabContent
          dropMethod={dropMethod}
          dropFile={dropFile}
          tip={newTip}
          activeTab={activeTab}
          topic={topic}
          group={selectedGroup}
        />
      </div>
    );
  }

  render() {
    const {
      props: {
        cardFormOnly,
        group,
        groups,
        match: {
          params: { group_id = null }
        }
      },
      state: { isItemPageOpen, isMainFormOpen }
    } = this;

    let selectedGroup = group;

    if (!selectedGroup) {
      selectedGroup = groups.find(grp => grp.attributes.slug === group_id);
    }
    return (
      <div>
        {isMainFormOpen && (
          <PageModal
            size="half"
            anim="slide"
            keyboard={false}
            location="secondary"
            onClose={this.closeMainForm}
          >
            {cardFormOnly ? this.getCardForm() : this.getMainFormPage()}
          </PageModal>
        )}
        {isItemPageOpen && (
          <ItemPage
            group={selectedGroup}
            editActive
            editActiveFromCardForm
            onClose={this.closeItemPage}
            isMainFormOpen={isMainFormOpen}
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
  groups: { collection }
}) => ({
  tip:
    tips.collection.find(tipsFilter) ||
    relatedTips.collection.find(tipsFilter) ||
    tips.tipBySlug,
  groups: collection
});

const mapDispatch = {
  filterBySlug: filterTipBySlug,
  add: createGroup,
  minimize: minimizeTip,
  filterGroup: filterGroupBySlug,
  reset: resetTip,
  clearContent: clearMainTipContent
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(MainFormPage)
);
