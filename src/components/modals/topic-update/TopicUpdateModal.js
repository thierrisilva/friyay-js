/* global vex */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TopicUpdateTabContent from 'Components/pages/topic_update_form_page/topic_update_tab_content';
import Ability from 'Lib/ability';
import tiphive from 'Lib/tiphive';
import { connect } from 'react-redux';
import LoadingIndicator from 'Components/shared/LoadingIndicator';

import RightModal from '../containers/RightModal';

import { stateMappings } from 'Src/newRedux/stateMappings';
import {
  getTopic,
  moveTopicContents,
  removeTopic,
  removeTopicAndMoveContent,
  updateTopic
} from 'Src/newRedux/database/topics/thunks';
import {
  ButtonMenuOpenDismiss,
  IconButton
} from 'Components/shared/buttons/index';

import colours from 'Lib/colours';
import SquareButton from 'Components/shared/buttons/SquareButton';
import ModalTabs from 'Components/modals/elements/ModalTabs';
import TopicDetailsEditor from './TopicDetailsEditor';

const tabOptions = ['General Settings', 'Share'];

class TopicUpdateModal extends Component {
  // static propTypes = {
  //   topic: PropTypes.object.isRequired,
  //   onClose: PropTypes.func.isRequired,
  //   removeTopic: PropTypes.func.isRequired,
  //   removeTopicAndMoveContent: PropTypes.func.isRequired,
  //   routerHistory: PropTypes.object,
  //   // moveTopic: PropTypes.func.isRequired,
  //   updateTopic: PropTypes.func.isRequired,
  //   isTaskView: PropTypes.bool
  // };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedTab: 'General Settings',
      topic: props.topic
    };
  }

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
    // $('[data-submenu]').submenupicker();
  }

  componentWillUnmount() {
    this.mounted_ = false;
  }

  handleChangeTopic = ({ attributes, relationships }) => {
    const { topic } = this.state;
    this.setState({
      topic: {
        ...topic,
        attributes: { ...topic.attributes, ...attributes },
        relationships: { ...topic.relationships, ...relationships }
      }
    });
  };

  handleSelectTab = selectedTab => {
    this.setState({ selectedTab });
  };

  handleToggleTab = () => {
    this.setState(state => ({
      selectedTab:
        state.selectedTab == tabOptions[0] ? tabOptions[1] : tabOptions[0]
    }));
  };

  handleSaveTopic = async e => {
    e.preventDefault();
    this.setState({ saving: true });
    await this.props.updateTopic(this.state.topic);
    this.setState({ saving: false });
    this.props.onClose();
  };

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
    const attributes = {
      title: topicTitle,
      description: topicDescription
    };
    const relationships = {
      share_settings: sharingItemIDs
    };

    await this.props.updateTopic({ id: topic.id, attributes, relationships });
    this.props.onClose();
    // this.props.updateTopic(
    //   topic.id,
    //   topicTitle,
    //   topicDescription,
    //   sharingItemIDs,
    //   adminUserIDs,
    //   topicPermissionData,
    // );
  };

  handleTopicDelete = e => {
    e.preventDefault();
    const { removeTopic, topic } = this.props;
    removeTopic(topic.id);
    // vex.dialog.confirm({
    //   message: 'Are you sure you want to delete this yay?',
    //   callback: value => {
    //     if (value) {
    //       let { topic } = this.props;
    //       this.props.removeTopic(topic.id);
    //
    //       if ( this.props.pageTopicId == topic.id ) {
    //         this.props.routerHistory.push( '/' )
    //       }
    //     }
    //   }
    // });
  };

  handleTopicDeleteAndMove = selectedTopics => {
    const topicIds = getIds(selectedTopics);
    const {
      props: { topic }
    } = this;
    this.props.removeTopicAndMoveContent(topic.id, selectedTopics[0].id);
    if (this.props.pageTopicId == topic.id) {
      this.props.routerHistory.push('/');
    }
  };

  handleTopicMove = selectedTopics =>
    this.handleTopicDeleteAndMove(selectedTopics);

  // handleTopicMove = selectedTopics => {
  //   const topicIds = getIds(selectedTopics);
  //   const topicSlugs = getSlugs(selectedTopics);
  //   const { props: { topic } } = this;
  //
  //   // this.props.moveTopic(topic.id, topicIds, topicSlugs);
  //   tiphive.hideAllModals();
  // }

  render() {
    const {
      props: { moveTopicContents, onClose, removeTopic },
      state: { loading, saving, selectedTab, topic }
    } = this;

    return (
      <RightModal>
        <div className="topic-update-modal">
          <div className="topic-update-modal_header">
            <IconButton
              additionalClasses="topic-update-modal_close-button"
              icon="clear"
              onClick={onClose}
            />

            <div className="topic-update-modal_title">yay SETTINGS</div>
            {Ability.can('delete', 'self', topic) && (
              <div className="topic-update-modal_header-buttons">
                <SquareButton
                  colour={colours.blue}
                  isSolid
                  onClick={moveTopicContents}
                >
                  Move
                </SquareButton>
                <SquareButton
                  additionalClasses="ml10"
                  colour={colours.red}
                  isSolid
                  onClick={removeTopic}
                >
                  Delete
                </SquareButton>
              </div>
            )}
          </div>
          {this.state.loading ? (
            <LoadingIndicator />
          ) : (
            <div className="topic-update-modal_content">
              <ModalTabs
                tabs={tabOptions}
                selectedTab={selectedTab}
                onSelectTab={this.handleSelectTab}
              />
              {selectedTab == tabOptions[0] && (
                <TopicDetailsEditor
                  onChangeTopic={this.handleChangeTopic}
                  topic={topic}
                />
              )}
              {selectedTab == tabOptions[1] && (
                <TopicSharingEditor
                  onChangeTopic={this.handleChangeTopic}
                  topic={topic}
                />
              )}
            </div>
          )}
          <div className="topic-update-modal_footer">
            <SquareButton
              colour={colours.blue}
              noBorder
              onClick={this.handleToggleTab}
            >
              {selectedTab == tabOptions[0] ? 'NEXT' : 'BACK'}
            </SquareButton>
            <SquareButton
              additionalClasses="ml10"
              colour={colours.blue}
              disabled={saving}
              onClick={this.handleSaveTopic}
            >
              {saving ? 'SAVING...' : 'SAVE & CLOSE'}
            </SquareButton>
          </div>
        </div>
      </RightModal>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  return {
    pageTopicId: sm.page.topicId,
    routerHistory: sm.routing.routerHistory
  };
};

const mapDispatch = {
  moveTopicContents,
  getTopic,
  removeTopic,
  removeTopicAndMoveContent,
  updateTopic
};

export default connect(
  mapState,
  mapDispatch
)(TopicUpdateModal);
