import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MainFormActions from 'Actions/main_form_actions';
import MainFormStore from '../../stores/main_form_store';
import PageModal from './page_modal';
import TipTabContent from './main_form_page/tip_tab_content';
import TopicTabContent from './main_form_page/topic_tab_content';
import GroupTabContent from './main_form_page/group_tab_content';
import { cardEditMode } from 'Src/newRedux/interface/page/thunks';
import ItemPage from './item_page';
import tiphive from 'Lib/tiphive';
import { failure } from 'Utils/toast';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { stateMappings } from 'Src/newRedux/stateMappings';
import { createGroup } from 'Src/newRedux/database/groups/thunks';
import { setDockOpen } from 'Src/newRedux/interface/dock/actions';
import {
  addCardToDock,
  removeCardFromDock
} from 'Src/newRedux/interface/dock/thunks';
import { setEditCardModalOpen } from 'Src/newRedux/interface/modals/actions';

class MainFormPage extends Component {
  static propTypes = {
    activeTab: PropTypes.string, //the tab in the edit card page
    group: PropTypes.object,
    groups: PropTypes.array,
    selectedTab: PropTypes.string, //Card/Topic/Group -> passed in from parent
    tip: PropTypes.object,
    topic: PropTypes.object,
    dropMethod: PropTypes.any, // TODO: fill this
    dropFile: PropTypes.any // TODO: fill this
  };

  static defaultProps = {
    selectedTab: null
  };

  state = {
    tipFormData: {},
    topicFormData: {},
    groupFormData: {},
    isMainFormOpen: true
  };

  componentDidMount() {
    const {
      props: { selectedTab }
    } = this;
    selectedTab !== null &&
      $(`#main-form-tabs a[href="#${selectedTab}"]`).tab('show');

    if (this.props.openFileUploader) {
      const uploadFileButton = document.getElementsByClassName(
        'js-file-upload-box-button'
      )[0];
      uploadFileButton && uploadFileButton.click();
    }
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
      topicPermissionsData
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
    const tidyUserIds = userIds.map(userId => userId.replace('users-', ''));

    const { createGroup, onClose, routerHistory } = this.props;

    const attributes = { title, description };
    const relationships = { user_followers: { data: tidyUserIds } };

    const newGroup = await createGroup({ attributes, relationships });
    onClose();
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
      failure('Please enter Group title');
      return false;
    }
  };

  getMainFormPage() {
    const {
      props: {
        dropMethod,
        dropFile,
        activeTab,
        group,
        topic,
        defaultAttributes,
        defaultRelationships
      }
    } = this;

    let selectedGroup = group;

    return (
      <div>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <a
              className="btn btn-link btn-close-side-left"
              data-dismiss="modal"
              onClick={this.handleClose}
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
            defaultAttributes={defaultAttributes}
            defaultRelationships={defaultRelationships}
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

  handleClose = () => {
    this.props.onClose && this.props.onClose();
    this.props.setEditCardModalOpen(false);
  };

  handleMinimize = () => {
    const {
      addCardToDock,
      tip,
      setDockOpen,
      setEditCardModalOpen
    } = this.props;
    if (tip) {
      addCardToDock(tip.id);
      setDockOpen(true);
      setEditCardModalOpen(false);
    }
  };

  handleMaximize = () => {
    const { cardEditMode } = this.props;
    this.props.onClose && this.props.onClose();
    this.props.setEditCardModalOpen(false);
    const {
      routerHistory,
      tip: {
        attributes: { slug }
      }
    } = this.props;
    cardEditMode(true);
    routerHistory.push(`cards/${slug}`);
  };

  getCardForm() {
    const {
      props: {
        dropMethod,
        dropFile,
        tip,
        activeTab,
        group,
        topic,
        defaultAttributes,
        defaultRelationships
      }
    } = this;

    let selectedGroup = group;
    const newTip = tip;
    const hasId = newTip !== null && newTip.id;

    return (
      <div className="tab-content card-form-content" id="main-form-tab-content">
        <div className="card-form-close-actions flex-r-center-end">
          <a
            className="btn-close"
            data-dismiss="modal"
            onClick={this.handleClose}
          >
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
          defaultAttributes={defaultAttributes}
          defaultRelationships={defaultRelationships}
          showMinMax={!!hasId}
          onClickMaximize={this.handleMaximize}
          onClickMinimize={this.handleMinimize}
        />
      </div>
    );
  }

  render() {
    const {
      props: { cardFormOnly, selectedTab, group, groups },
      state: { isItemPageOpen, isMainFormOpen }
    } = this;

    let selectedGroup = group;

    return (
      <div>
        <PageModal
          size="half"
          anim="slide"
          keyboard={false}
          location="secondary"
          onClose={this.handleClose}
        >
          {cardFormOnly ? this.getCardForm() : this.getMainFormPage()}
        </PageModal>
      </div>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    activeTab: props.selectedTab || sm.modals.displayEditCardModal.tab,
    defaultAttributes: get(sm.modals, 'displayEditCardModal.defaultAttributes'),
    defaultRelationships: get(
      sm.modals,
      'displayEditCardModal.defaultRelationships'
    ),
    group: sm.groups[sm.page.groupId],
    groups: Object.values(sm.groups),
    openFileUploader: get(sm.modals, 'displayEditCardModal.openFileUploader'),
    routerHistory: sm.routing.routerHistory,
    tip: sm.cards[get(sm.modals, 'displayEditCardModal.cardId')] || null,
    topic: sm.topics[sm.page.topicId] || null
  };
};

const mapDispatch = {
  addCardToDock,
  createGroup,
  removeCardFromDock,
  setDockOpen,
  setEditCardModalOpen,
  cardEditMode
};

export default connect(
  mapState,
  mapDispatch
)(MainFormPage);
