import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SharingSelectMenu from '../../shared/sharing_select_menu';
import Ability from '../../../lib/ability';
import IconHex from '../../svg_icons/icon_hex';
import { TextArea, Input } from '../../shared/forms';
import PermissionsList from './topic_tab_content/permissions_list';

export default class TopicTabContent extends Component {
  static propTypes = {
    onTopicSlide: PropTypes.func,
    handleTopicFormSubmit: PropTypes.func,
    handleTopicFormNext: PropTypes.func,
    handleTopicFormBack: PropTypes.func,
    group: PropTypes.object
  };

  componentDidMount() {
    const $topicCarousel = $('#carousel-topic-form').carousel({
      interval: false,
      keyboard: false
    });

    $topicCarousel.on('slide.bs.carousel', this.props.onTopicSlide);
  }

  render() {
    let newTopicTabContent = null;

    if (
      window.currentDomain &&
      Ability.cannot('create', 'topics', window.currentDomain)
    ) {
      newTopicTabContent = (
        <div className="text-center pop-up-banner">
          This Workspace has limited yay creation to administrators.
        </div>
      );
    } else {
      const {
        props: {
          handleTopicFormSubmit,
          handleTopicFormNext,
          handleTopicFormBack,
          group
        }
      } = this;

      let selectedSharingItems = [];

      if (group) {
        selectedSharingItems = [
          {
            id: `groups-${group.id}`,
            name: group.attributes.title
          }
        ];
      }

      newTopicTabContent = (
        <form
          className="main-form"
          id="main-topic-form"
          method="post"
          onSubmit={handleTopicFormSubmit}
        >
          <div
            id="carousel-topic-form"
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
                <a>Share</a>
              </li>
              {/* {window.APP_ENV !== 'production' &&
                window.isSubdomain && (
                  <li
                    role="presentation"
                    data-target="#carousel-topic-form"
                    data-slide-to="2"
                  >
                    <a>Administrators</a>
                  </li>
                )}
              {window.APP_ENV !== 'production' &&
                window.isSubdomain && (
                  <li
                    role="presentation"
                    data-target="#carousel-topic-form"
                    data-slide-to="3"
                  >
                    <a>Permissions</a>
                  </li>
                )} */}
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
                      required
                    />
                  </div>
                  <div className="form-group">
                    <TextArea
                      id="topic_description"
                      className="form-control"
                      name="topic[description]"
                      placeholder="Optional: Describe what this yay is about"
                    />
                  </div>
                </div>
                <div className="navbar navbar-inverse navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      href="javascript:void(0)"
                      className="btn btn-link btn-next"
                      onClick={handleTopicFormNext}
                    >
                      NEXT
                    </a>
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
                      className="text-muted mr15"
                      onClick={handleTopicFormBack}
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

              {/* <div className="item">
                <div className="panel-body">
                  <SharingSelectMenu
                    sharingFor="admin"
                    sharableTypes={['User']}
                    selectTitle="Select administrators"
                    hasDefaultSharingItems={false}
                    selectedSharingItems={[]}
                  />
                </div>
                <div className="navbar navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      className="text-muted"
                      onClick={handleTopicFormBack}
                    >
                      Back
                    </a>

                    <a
                      className="btn btn-link btn-next"
                      onClick={handleTopicFormNext}
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
              </div> */}

              {/* <div className="item">
                <div className="panel-body">
                  <PermissionsList
                    permissionFor="topic"
                    objectName="Topic"
                    existingPermissions={{}}
                  />
                </div>
                <div className="navbar navbar-inverse navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      href="javascript:void(0)"
                      className="text-muted mr15"
                      onClick={handleTopicFormBack}
                      style={{ marginRight: 10 }}
                    >
                      BACK
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
              </div> */}
            </div>
          </div>
        </form>
      );
    }

    return (
      <div className="tab-pane" role="tabpanel" id="topic-pane">
        {newTopicTabContent}
      </div>
    );
  }
}
