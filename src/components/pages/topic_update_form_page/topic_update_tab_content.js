import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import SharingSelectMenu from '../../shared/sharing_select_menu';
import PermissionsList from '../../pages/main_form_page/topic_tab_content/permissions_list';
import PlanItem from 'Components/pages/main_form_page/topic_tab_content/plan_item';
import { setUpdateTopicModalOpen } from 'Src/newRedux/interface/modals/actions';
import IconHex from '../../svg_icons/icon_hex';
import { TextArea, Input } from '../../shared/forms';
import get from 'lodash/get';
import { getTopic, updateTopic } from 'Src/newRedux/database/topics/thunks';
import LoadingIndicator from 'Components/shared/LoadingIndicator';
import {
  buildGroupData,
  buildUserData,
  buildAdminRolesData
} from 'Src/utils/buildTipData';
class TopicUpdateTabContent extends React.Component {
  state = {
    loading: true
  };

  async componentDidMount() {
    const {
      getTopic,
      topic: {
        attributes: { slug }
      }
    } = this.props;
    await getTopic({ topicSlug: slug });
    this.setState({ loading: false });
  }

  handleTopicUpdateFormSubmit = async e => {
    e.preventDefault();

    let {
      props: { topic }
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

    const planData = this.planTabContent.state;

    const attributes = {
      title: topicTitle,
      description: topicDescription,
      start_date: moment(planData.startDateValue).toISOString(),
      due_date: moment(planData.dueDateValue).toISOString(),
      completion_date: moment(planData.completionDateValue).toISOString(),
      expected_completion_date: moment(
        planData.expectedCompletionDateValue
      ).toISOString(),
      points: planData.pointsValue,
      cactii: planData.cactiiValue,
      completed_percentage: planData.completionValue,
      priority_level: planData.priorityValue,
      resource_required: planData.workEstimationValue
    };

    const relationships = {
      share_settings: { data: users.data.concat(groups.data) },
      roles: admins,
      topic_permission: topicPermissionData
    };

    await this.props.updateTopic({ id: topic.id, attributes, relationships });
    this.props.onClose();
  };

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }

    let topic = this.props.topic;

    let attributes = topic.attributes;
    let relationships = topic.relationships;
    let sharedItems = relationships.share_settings;
    let roles = relationships.roles;
    let permissions = get(relationships, 'topic_permission.data.access_hash');

    // let domainPermissions = relationships.topic_permission.data.domain_access_hash;

    let selectedSharingItems = [];
    if (sharedItems && sharedItems.data) {
      for (let item of sharedItems.data.filter(itm => !!itm)) {
        let sharedItem = {
          id: item.sharing_object_type + '-' + item.sharing_object_id,
          name: item.sharing_object_name
        };
        selectedSharingItems.push(sharedItem);
      }
    }

    let selectedRoleUsers = [];
    if (roles && roles.data) {
      $(roles.data).each((index, role) => {
        let selectedRoleUser = {
          id: 'users-' + role.user_id,
          name: role.user_name
        };
        selectedRoleUsers.push(selectedRoleUser);
      });
    }

    let existingPermissions = permissions;
    let permissionID = get(relationships, 'topic_permission.data.id');

    let buttonStyle = {
      marginRight: '10px'
    };

    setTimeout(() => $('.carousel').carousel(this.props.defaultTab), 0);

    return (
      <div className="tab-pane active" role="tabpanel" id="topic-pane">
        <form
          className="main-form"
          id="main-topic-form"
          ref="mainTopicForm"
          method="post"
          onSubmit={this.handleTopicUpdateFormSubmit}
        >
          <input
            type="hidden"
            id="topic_id"
            name="topic[id]"
            ref="topicID"
            value={topic.id}
          />

          <div
            id="carousel-topic-form"
            ref="carouselTopicForm"
            className="carousel"
            data-ride="carousel"
            data-interval="false"
            data-keyboard="false"
          >
            <ul className="slide-indicators nav nav-pills main-form-content-nav">
              <li
                role="presentation"
                className="active"
                data-target="#carousel-topic-form"
                data-slide-to="0"
              >
                <a href="javascript:void(0)">General settings</a>
              </li>
              <li
                role="presentation"
                data-target="#carousel-topic-form"
                data-slide-to="1"
              >
                <a href="javascript:void(0)">Share</a>
              </li>
              {window.APP_ENV !== 'production' && window.isSubdomain && (
                <li
                  role="presentation"
                  data-target="#carousel-topic-form"
                  data-slide-to="2"
                >
                  <a href="javascript:void(0)">Administrators</a>
                </li>
              )}
              {window.APP_ENV !== 'production' && window.isSubdomain && (
                <li
                  role="presentation"
                  data-target="#carousel-topic-form"
                  data-slide-to="3"
                >
                  <a href="javascript:void(0)">Permissions</a>
                </li>
              )}
              {
                <li
                  role="presentation"
                  data-target="#carousel-topic-form"
                  data-slide-to="4"
                >
                  <a href="javascript:void(0)">Plan</a>
                </li>
              }
            </ul>

            <div className="carousel-inner" role="listbox">
              <div className="item active">
                <div className="panel-body">
                  <div className="form-group topic-title-input-group">
                    <IconHex
                      width="100%"
                      height="100%"
                      fill="rgb(245,245,245)"
                      scaleViewBox={false}
                      strokeWidth="0"
                    />

                    <Input
                      type="text"
                      id="topic_title"
                      name="topic[title]"
                      className="form-control form-control-minimal"
                      placeholder="Type yay Title"
                      autoComplete="off"
                      defaultValue={attributes.title}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <TextArea
                      id="topic_description"
                      name="topic[description]"
                      defaultValue={attributes.description}
                      placeholder="Optional: Describe what this yay is about"
                    />
                  </div>
                </div>
                <div className="navbar navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      href="javascript:void(0)"
                      className="btn btn-link btn-next"
                      onClick={this.props.handleTopicFormNext}
                    >
                      NEXT
                    </a>
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-save"
                      value="SAVE & CLOSE"
                      data-disable-with="Saving..."
                    />
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="panel-body">
                  <SharingSelectMenu
                    sharingFor="topic"
                    selectedSharingItems={selectedSharingItems}
                  />
                </div>
                <div className="navbar navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      href="javascript:void(0)"
                      className="text-muted mr15"
                      onClick={this.props.handleTopicFormBack}
                    >
                      Back
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="btn btn-link btn-next"
                      onClick={this.props.handleTopicFormNext}
                    >
                      NEXT
                    </a>
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-save"
                      value="SAVE & CLOSE"
                      data-disable-with="Saving..."
                    />
                  </div>
                </div>
              </div>

              {/* -------- BELOW NOT SHOWN ON PRODUCTION ---------- */}

              <div className="item">
                <div className="panel-body">
                  <SharingSelectMenu
                    sharingFor="admin"
                    sharableTypes={['User']}
                    sharingObject={topic}
                    selectTitle="Select administrators"
                    hasDefaultSharingItems={false}
                    selectedSharingItems={selectedRoleUsers}
                  />
                </div>
                <div className="navbar navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      href="javascript:void(0)"
                      className="text-muted mr15"
                      onClick={this.props.handleTopicFormBack}
                    >
                      Back
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="btn btn-link btn-next"
                      onClick={this.props.handleTopicFormNext}
                    >
                      NEXT
                    </a>
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-save"
                      value="SAVE & CLOSE"
                      data-disable-with="Saving..."
                    />
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="panel-body">
                  <PermissionsList
                    permissionFor="topic"
                    objectName="Topic"
                    existingPermissions={existingPermissions}
                    permissionID={permissionID}
                  />
                </div>
                <div className="navbar navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      href="javascript:void(0)"
                      className="text-muted mr15"
                      onClick={this.props.handleTopicFormBack}
                    >
                      Back
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="btn btn-link btn-next"
                      onClick={this.props.handleTopicFormNext}
                    >
                      NEXT
                    </a>
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-save"
                      value="SAVE & CLOSE"
                      data-disable-with="Saving..."
                    />
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="panel-body">
                  <PlanItem
                    ref={ref => (this.planTabContent = ref)}
                    topic={topic}
                  />
                </div>
                <div className="navbar navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      href="javascript:void(0)"
                      className="text-muted mr15"
                      onClick={this.props.handleTopicFormBack}
                    >
                      Back
                    </a>
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-save"
                      value="SAVE & CLOSE"
                      data-disable-with="Saving..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatch = {
  getTopic,
  onClose: () => setUpdateTopicModalOpen(null, false),
  updateTopic
};

export default connect(
  null,
  mapDispatch
)(TopicUpdateTabContent);
