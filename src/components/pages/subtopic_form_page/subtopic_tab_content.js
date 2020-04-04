import React from 'react';
import createClass from 'create-react-class';
import SharingSelectMenu from '../../shared/sharing_select_menu';

import IconHex from '../../svg_icons/icon_hex';
import { ButtonNavBar } from '../../shared/buttons';
import { TextArea, Input } from '../../shared/forms';

var SubtopicTabContent = createClass({
  componentDidMount: function() {
    var $topicCarousel = $('#carousel-topic-form').carousel({
      interval: false,
      keyboard: false
    });

    $topicCarousel.on('slide.bs.carousel', this.props.onTopicSlide);
  },

  render: function() {
    var buttonStyle = {
      marginRight: '10px'
    };
    const {
      fromTaskList,
      parentTopic,
      handleTopicFormNext,
      handleTopicFormBack
    } = this.props;
    let sharedItems, topicPath;

    if (fromTaskList) {
      sharedItems = parentTopic.share_settings;
      topicPath = parentTopic.path;
    } else {
      sharedItems = parentTopic.relationships.share_settings;
      topicPath = parentTopic.attributes.path;
    }

    var selectedSharingItems = [];
    if (sharedItems && sharedItems.data) {
      $.each(sharedItems.data, (index, item) => {
        var sharedItem = {
          id: item.sharing_object_type + '-' + item.sharing_object_id,
          name: item.sharing_object_name
        };
        selectedSharingItems.push(sharedItem);
      });
    }

    return (
      <div className="tab-pane active" role="tabpanel" id="subtopic-pane">
        <form
          className="main-form"
          id="main-topic-form"
          ref="mainTopicForm"
          method="post"
          onSubmit={this.props.handleTopicFormSubmit}
        >
          <div
            id="carousel-topic-form"
            ref="carouselTopicForm"
            className="carousel"
            data-ride="carousel"
            data-interval="false"
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
            </ul>

            <div className="carousel-inner" role="listbox">
              <div className="item active">
                <div className="panel-body">
                  <div className="future-location-path">
                    <div className="future-icon-hex-container">
                      {/* ---- FUTURE PLACE FOR MINI HEX ICON + BREADCRUMBS(BELOW) */}
                    </div>
                  </div>

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
                      autoComplete="off"
                      placeholder="Type yay Title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <TextArea
                      id="topic_description"
                      name="topic[description]"
                      placeholder="Optional: Describe what this yay is about"
                    />
                  </div>
                </div>

                <div className="navbar navbar-fixed-bottom">
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
                    isSubtopic
                  />
                </div>
                <div className="navbar navbar-inverse navbar-fixed-bottom">
                  <div className="pull-right">
                    <a
                      href="javascript:void(0)"
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
              {/* END Item */}
            </div>
            {/* END Carousel-inner */}
          </div>
        </form>
      </div>
    );
  }
});

export default SubtopicTabContent;
