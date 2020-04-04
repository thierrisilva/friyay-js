/* global vex */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TopicsListDropdown from '../shared/topics_list_dropdown';
import PageModal from './page_modal';
import TopicUpdateTabContent from './topic_update_form_page/topic_update_tab_content';
import Ability from 'Lib/ability';
import { connect } from 'react-redux';
import LoadingIndicator from 'Components/shared/LoadingIndicator';

import { map, join, prop, compose } from 'ramda';

import {
  buildGroupData,
  buildUserData,
  buildAdminRolesData
} from 'Src/utils/buildTipData';

import { stateMappings } from 'Src/newRedux/stateMappings';
import {
  getTopic,
  moveTopicContents,
  removeTopic,
  removeTopicAndMoveContent,
  updateTopic
} from 'Src/newRedux/database/topics/thunks';
import { setUpdateTopicModalOpen } from 'Src/newRedux/interface/modals/actions';

class TopicUpdateFormPage extends Component {
  static propTypes = {
    topic: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    removeTopic: PropTypes.func.isRequired,
    removeTopicAndMoveContent: PropTypes.func.isRequired,
    routerHistory: PropTypes.object,
    moveTopicContents: PropTypes.func.isRequired,
    updateTopic: PropTypes.func.isRequired,
    isTaskView: PropTypes.bool
  };

  static defaultProps = {
    isTaskView: false
  };

  state = {
    loading: true
  };

  async componentDidMount() {
    this.mounted_ = true;
    if (!this.props.topic.relationships) {
      this.setState({ loading: true });
      await this.props.getTopic({
        topicSlug: this.props.topic.attributes.slug
      });
      this.mounted_ && this.setState({ loading: false });
    } else {
      this.setState({ loading: false });
    }
    $('[data-submenu]').submenupicker();
  }

  componentWillUnmount() {
    this.mounted_ = false;
  }

  handleTopicFormBack(e) {
    e.preventDefault();
    $('#carousel-topic-form').carousel('prev');
  }

  handleTopicFormNext(e) {
    e.preventDefault();
    $('#carousel-topic-form').carousel('next');
  }

  handleTopicUpdateFormSubmit = async e => {
    e.preventDefault();

    let {
      props: { topic, isTaskView }
    } = this;

    let topicTitle = $('#main-topic-form #topic_title')
      .val()
      .trim();
    let topicDescription = $('#main-topic-form #topic_description')
      .val()
      .trim();
    let sharingItemIDs = $('#main-topic-form #topic_sharing_item_ids').val();
    let adminUserIDs = $('#main-topic-form #admin_sharing_item_ids').val();

    let topicPermissionData = null;
    let permissionID = $('#main-topic-form .permissions-topic').data(
      'permission-id'
    );
    let accessHash = {};
    $('select[name^="topic-permissions"]').each((index, elem) => {
      let $elem = $(elem);

      let action = $elem.data('action');
      let permissionValue = $elem.val();

      if (permissionValue) {
        accessHash[action] = {
          roles: permissionValue
        };
      } else {
        accessHash[action] = {
          roles: {}
        };
      }
    });

    if (window.isSubdomain === false) {
      adminUserIDs = null;
      topicPermissionData = null;
    } else {
      topicPermissionData = {
        data: { id: permissionID, access_hash: accessHash }
      };
    }

    const users = buildUserData(sharingItemIDs);
    const groups = buildGroupData(sharingItemIDs);
    const admins = buildAdminRolesData(adminUserIDs);

    const attributes = {
      title: topicTitle,
      description: topicDescription
    };

    const relationships = {
      share_settings: { data: users.data.concat(groups.data) },
      roles: admins,
      topic_permission: topicPermissionData
    };

    await this.props.updateTopic({ id: topic.id, attributes, relationships });
    this.props.onClose();
  };

  handleTopicDelete = e => {
    e.preventDefault();
    const { removeTopic, topic } = this.props;
    removeTopic(topic.id);
  };

  handleTopicDeleteAndMove = selectedTopics => {
    const {
      props: { topic }
    } = this;
    this.props.removeTopicAndMoveContent(topic.id, selectedTopics[0].id);
  };
  // handleTopicMove = selectedTopics => this.handleTopicDeleteAndMove( selectedTopics )

  handleTopicMove = selectedTopics => {
    const destinationTopicId = selectedTopics[0].id;
    const {
      props: { topic }
    } = this;
    this.props.moveTopicContents({ destinationTopicId, topicId: topic.id });
    this.props.onClose();
  };

  render() {
    const {
      props: { topic, onClose }
    } = this;

    let topicMoveAction = null;
    let topicDeleteAction = null;

    if (Ability.can('delete', 'self', topic)) {
      topicMoveAction = (
        <span className="mr5">
          <a
            className="btn btn-default navbar-btn dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Move <span className="caret" />
          </a>
          <TopicsListDropdown
            actionButtonLabel="Move"
            actionButtonHandler={this.handleTopicMove}
            actionButtonClass="btn-primary"
            path={topic.attributes.path}
            startAt={topic.id}
            isCollapsed
            isRequired
          />
        </span>
      );

      topicDeleteAction = (
        <span>
          <a
            className="btn btn-danger navbar-btn dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            data-submenu
          >
            Delete <span className="caret" />
          </a>
          <ul className="dropdown-menu">
            <li>
              <a onClick={this.handleTopicDelete}>
                Delete this yay and all it&apos;s yays and Archive all Cards in
                this yay
              </a>
            </li>

            <li className="dropdown-submenu">
              <a
                tabIndex="0"
                className="dropdown-toggle"
                data-toggle="dropdown"
                data-persist="true"
              >
                Delete this yay and Move all yays and Cards here to another yay
              </a>

              <TopicsListDropdown
                actionButtonLabel="Delete and Move"
                actionButtonHandler={this.handleTopicDeleteAndMove}
                actionButtonClass="btn-danger"
                path={topic.attributes.path}
                startAt={topic.id}
                isRequired
              />
            </li>
          </ul>
        </span>
      );
    }

    return (
      <PageModal
        size="half"
        anim="slide"
        backdrop="static"
        keyboard={false}
        onClose={onClose}
      >
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <a
              className="btn btn-link btn-close-side-left"
              data-dismiss="modal"
              onClick={this.props.onClose}
            >
              <i className="material-icons">clear</i>
            </a>

            <ul className="nav navbar-nav" role="tablist">
              <li role="presentation" className="active">
                <a
                  href="#topic-pane"
                  aria-controls="home"
                  role="tab"
                  data-toggle="tab"
                >
                  yay SETTINGS
                </a>
              </li>
            </ul>

            <div className="nav navbar-nav navbar-right mr0">
              {topicMoveAction}
              {topicDeleteAction}
            </div>
          </div>
        </nav>

        <div className="tab-content" id="main-form-tab-content">
          {this.state.loading ? (
            <LoadingIndicator />
          ) : (
            <TopicUpdateTabContent
              defaultTab={this.props.topicUpdateModalState.tab}
              topic={topic}
              handleTopicFormBack={this.handleTopicFormBack}
              handleTopicFormNext={this.handleTopicFormNext}
              handleTopicUpdateFormSubmit={this.handleTopicUpdateFormSubmit}
            />
          )}
        </div>
      </PageModal>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const displayUpdateTopicModal = sm.modals.displayUpdateTopicModal;

  return {
    pageTopicId: sm.page.topicId,
    routerHistory: sm.routing.routerHistory,
    topic: sm.topics[displayUpdateTopicModal.topicId] || null,
    topicUpdateModalState: displayUpdateTopicModal
  };
};

const mapDispatch = {
  getTopic,
  moveTopicContents,
  onClose: () => setUpdateTopicModalOpen(null, false),
  removeTopic,
  removeTopicAndMoveContent,
  updateTopic
};

export default connect(
  mapState,
  mapDispatch
)(TopicUpdateFormPage);
