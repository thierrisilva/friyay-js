import React from 'react';
import PropTypes from 'prop-types';
import TextEditor from '../../shared/text_editor';
import AttachmentActions from '../../../actions/attachment_actions';
import createClass from 'create-react-class';
import AttachmentStore from '../../../stores/attachment_store';

import FileUploadBox from '../../shared/file_upload_box';
import TopicsSelectMenu from '../../shared/topics_select_menu';
import SharingSelectMenu from '../../shared/sharing_select_menu';

import Ability from '../../../lib/ability';
import FormAutoSave from '../../../lib/form_auto_save';

import { Input, InputWithHiddenLabel } from '../../shared/forms';
import LabelTabContent from '../main_form_page/tip_tab_content/label_tab_content';

var TopicTipTabContent = createClass({
  getInitialState: function() {
    return {
      tipAutoSave: null,
      autoSaveContent: null,
      uploadedFiles: [],
      reloadingUploadedFiles: false
    };
  },

  propTypes: {
    group: PropTypes.object,
    topic: PropTypes.object
  },

  componentDidMount: function() {
    AttachmentStore.addEventListener(
      window.ATTACHMENTS_LOAD_EVENT,
      this.onAttachmentsLoad
    );

    var $tipCarousel = $('#carousel-tip-form').carousel({
      interval: false,
      keyboard: false
    });

    $tipCarousel.on('slide.bs.carousel', this.props.onTipSlide);

    var autoSave = new FormAutoSave({
      formID: 'main-tip-form',
      formFieldIDs: ['tip_title', 'tip_body', 'tip_attachment_ids']
    });

    var autoSaveContent = autoSave.getContent();
    var tipFormContent = autoSaveContent['main-tip-form'];

    if (tipFormContent) {
      $('#tip_title').val(tipFormContent['tip_title']);
      $('#tip_body').val(tipFormContent['tip_body']);
      $('#tip_attachment_ids').val(tipFormContent['tip_attachment_ids']);

      this.refs.tipBodyEditor.setText(tipFormContent['tip_body'] || null);

      if (tipFormContent['tip_attachment_ids']) {
        var attachmentIDs = tipFormContent['tip_attachment_ids'].split(',');

        AttachmentActions.loadAttachments(attachmentIDs);
        this.setState({
          reloadingUploadedFiles: true
        });
      }
    }

    this.setState({
      tipAutoSave: autoSave,
      autoSaveContent: autoSaveContent
    });

    autoSave.saveContent();
  },

  componentWillUnmount: function() {
    AttachmentStore.removeEventListener(
      window.ATTACHMENTS_LOAD_EVENT,
      this.onAttachmentsLoad
    );

    var tipAutoSave = this.state.tipAutoSave;

    tipAutoSave.saveContent();
    tipAutoSave.stop();

    this.setState({
      tipAutoSave: null
    });
  },

  onAttachmentsLoad: function(attachments) {
    if (!attachments || attachments.length === 0) return;

    var uploadedFiles = [];
    $(attachments).each(function(index, attachment) {
      uploadedFiles.push({
        response: {
          data: attachment
        },
        localData: {
          preview: null
        }
      });
    });

    this.setState({
      reloadingUploadedFiles: false,
      uploadedFiles: uploadedFiles
    });
  },

  render: function() {
    var reloadingUploadedFiles = this.state.reloadingUploadedFiles;
    var uploadedFiles = this.state.uploadedFiles;

    var fileUploadBox;
    if (reloadingUploadedFiles) {
      fileUploadBox = (
        <p className="text-center">
          Loading auto saved uploads... <img src="/images/ajax-loader.gif" />
        </p>
      );
    } else {
      fileUploadBox = (
        <FileUploadBox objectType="tip" uploadedFiles={uploadedFiles} />
      );
    }

    var group = this.props.group;
    var topic = this.props.topic;

    var selectedSharingItems = [];
    var selectedTopics = [];

    var selectedGroup;
    var selectedTopic;

    if (topic) {
      selectedTopic = {
        id: topic.id,
        title: topic.attributes.title,
        kind: topic.attributes.kind
      };
      selectedTopics.push(selectedTopic);

      var relationships = topic.relationships;
      var sharedItems = relationships.share_settings;

      if (sharedItems && sharedItems.data) {
        $(sharedItems.data).each((index, item) => {
          if (selectedGroup && selectedGroup.id === 'groups-' + item.id) {
            return true;
          }

          let sharedItem = {
            id: item.sharing_object_type + '-' + item.sharing_object_id,
            name: item.sharing_object_name
          };

          selectedSharingItems.push(sharedItem);
        });
      }
    }

    var buttonStyle = {
      marginRight: '10px'
    };

    var newTipTabContent = (
      <form
        className="main-form"
        id="main-tip-form"
        ref="mainTipForm"
        method="post"
        onSubmit={this.props.handleTipFormSubmit}
      >
        <div
          id="carousel-tip-form"
          ref="carouselTipForm"
          className="carousel"
          data-ride="carousel"
          data-interval="false"
          data-keyboard="false"
        >
          <ul className="slide-indicators nav nav-pills main-form-content-nav">
            <li
              role="presentation"
              className="active"
              data-target="#carousel-tip-form"
              data-slide-to="0"
            >
              <a href="javascript:void(0)">Create</a>
            </li>

            <li
              role="presentation"
              data-target="#carousel-tip-form"
              data-slide-to="1"
            >
              <a href="javascript:void(0)">Organize</a>
            </li>

            <li
              role="presentation"
              data-target="#carousel-tip-form"
              data-slide-to="2"
            >
              <a href="javascript:void(0)">Share</a>
            </li>

            <li
              role="presentation"
              data-target="#carousel-tip-form"
              data-slide-to="3"
            >
              <a href="javascript:void(0)">Label</a>
            </li>
          </ul>

          <div className="carousel-inner" role="listbox">
            <div className="item active">
              <div className="panel-body item-create-tab">
                <div>
                  <Input
                    type="text"
                    id="tip_title"
                    name="tip[title]"
                    className="form-control form-control-minimal tip-title"
                    placeholder="Type title"
                    autoComplete="off"
                    tabIndex={1}
                    required
                  />
                </div>
                <div className="form-group tip-text-attachments">
                  <div className="form-group tip-text-editor-container">
                    <textarea
                      className="form-control hide invisible"
                      id="tip_body"
                      name="tip[body]"
                      ref="tipBody"
                      rows="15"
                      placeholder="Write your text here"
                      required
                    />
                    <TextEditor
                      targetInputID="tip_body"
                      tabIndex={2}
                      placeholder="Write your text here"
                      ref="tipBodyEditor"
                      required
                    />
                  </div>
                  <div className="flex-1">{fileUploadBox}</div>
                </div>
              </div>
              <div className="navbar navbar-inverse navbar-fixed-bottom">
                <div className="container-fluid">
                  <input
                    type="submit"
                    name="submit"
                    className="btn btn-default navbar-btn"
                    value="SAVE & CLOSE"
                    data-disable-with="Saving..."
                    style={buttonStyle}
                  />

                  <a
                    href="javascript:void(0)"
                    className="btn btn-default navbar-btn"
                    onClick={this.props.handleTipFormNext}
                  >
                    NEXT
                  </a>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="panel-body">
                <TopicsSelectMenu
                  topicsOf="tip"
                  selectedTopics={selectedTopics}
                  selectTitle="Add Card to yays"
                  isRequired
                />
              </div>
              <div className="navbar navbar-inverse navbar-fixed-bottom">
                <div className="container-fluid">
                  <input
                    type="submit"
                    name="submit"
                    className="btn btn-default navbar-btn"
                    value="SAVE & CLOSE"
                    data-disable-with="Saving..."
                    style={buttonStyle}
                  />

                  <a
                    href="javascript:void(0)"
                    className="btn btn-default navbar-btn"
                    onClick={this.props.handleTipFormNext}
                    style={buttonStyle}
                  >
                    NEXT
                  </a>

                  <a
                    href="javascript:void(0)"
                    className="text-muted"
                    onClick={this.props.handleTipFormBack}
                  >
                    Back
                  </a>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="panel-body">
                <SharingSelectMenu
                  selectedSharingItems={selectedSharingItems}
                />
              </div>
              <div className="navbar navbar-inverse navbar-fixed-bottom">
                <div className="container-fluid">
                  <input
                    type="submit"
                    name="submit"
                    className="btn btn-default navbar-btn"
                    value="SAVE & CLOSE"
                    data-disable-with="Saving..."
                    style={buttonStyle}
                  />

                  <a
                    href="javascript:void(0)"
                    className="btn btn-default navbar-btn"
                    onClick={this.props.handleTipFormNext}
                    style={buttonStyle}
                  >
                    NEXT
                  </a>

                  <a
                    href="javascript:void(0)"
                    className="text-muted"
                    onClick={this.props.handleTipFormBack}
                  >
                    Back
                  </a>
                </div>
              </div>
            </div>

            <div className="item">
              <div className="panel-body">
                <LabelTabContent />
              </div>
              <div className="navbar navbar-inverse navbar-fixed-bottom">
                <div className="container-fluid">
                  <input
                    type="submit"
                    name="submit"
                    className="btn btn-default navbar-btn"
                    value="SAVE & CLOSE"
                    data-disable-with="Saving..."
                    style={buttonStyle}
                  />
                  <a
                    href="javascript:void(0)"
                    className="text-muted"
                    onClick={this.props.handleTipFormBack}
                  >
                    Back
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );

    if (
      window.currentDomain &&
      Ability.can('create', 'tips', window.currentDomain) === false
    ) {
      newTipTabContent = (
        <div className="text-center pop-up-banner">
          This Workspace has limited Card creation to administrators.
        </div>
      );
    }

    return (
      <div className="tab-pane active" role="tabpanel" id="tip-pane">
        {newTipTabContent}
      </div>
    );
  }
});

export default TopicTipTabContent;
