import React from 'react';
import MainFormActions from '../../actions/main_form_actions';
import MainFormStore from '../../stores/main_form_store';
import PageModal from './page_modal';
import SubtopicTabContent from './subtopic_form_page/subtopic_tab_content';
import APIRequest from '../../lib/ApiRequest';
import tiphive from '../../lib/tiphive';
import createClass from 'create-react-class';

var SubtopicFormPage = createClass({
  componentDidMount: function() {
    MainFormStore.addEventListener(
      window.TOPIC_CREATE_EVENT,
      this.onFormChange
    );
  },

  componentWillUnmount: function() {
    MainFormStore.removeEventListener(
      window.TOPIC_CREATE_EVENT,
      this.onFormChange
    );
  },

  handleTopicFormBack: function(e) {
    e.preventDefault();

    $('#carousel-topic-form').carousel('prev');
  },

  handleTopicFormNext: function(e) {
    e.preventDefault();

    $('#carousel-topic-form').carousel('next');
  },

  handleTopicFormSubmit: function(e) {
    e.preventDefault();

    var topicTitle = $('#main-topic-form #topic_title')
      .val()
      .trim();
    var topicDescription = $('#main-topic-form #topic_description')
      .val()
      .trim();
    var sharingItemIDs = $('#main-topic-form #topic_sharing_item_ids').val();
    var parentID = this.props.parentTopic.id;
    const { fromTaskList, fromLeftSubtopicMenu } = this.props;
    if (parentID) {
      MainFormActions.createSubtopic(
        topicTitle,
        topicDescription,
        sharingItemIDs,
        parentID,
        fromTaskList,
        fromLeftSubtopicMenu
      );
    } else {
      APIRequest.showInfoMessage('Could not find parent yay');
    }
  },

  onTopicSlide: function(e) {
    var direction = e.direction;
    var $target = $(e.relatedTarget);
    var slideIndex = $target
      .parent()
      .find('.item')
      .index($target);

    var topicTitle = $('#main-topic-form #topic_title')
      .val()
      .trim();

    if (direction === 'left' && slideIndex === 1 && topicTitle === '') {
      APIRequest.showErrorMessage('Please enter yay title');
      return false;
    }
  },

  onFormChange: function() {
    tiphive.hidePrimaryModal();
  },

  render: function() {
    const { fromTaskList, onClose } = this.props;
    return (
      <PageModal size="half" anim="slide" onClose={onClose}>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <a
              href="javascript:void(0)"
              className="btn btn-link btn-close-side-left"
              data-dismiss="modal"
            >
              <i className="material-icons">clear</i>
            </a>

            <ul className="nav navbar-nav" role="tablist">
              <li role="presentation" className="active">
                <a
                  href="#subtopic-pane"
                  aria-controls="home"
                  role="tab"
                  data-toggle="tab"
                >
                  ADD yay
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="tab-content" id="main-form-tab-content">
          <SubtopicTabContent
            parentTopic={this.props.parentTopic}
            fromTaskList={fromTaskList}
            handleTopicFormBack={this.handleTopicFormBack}
            handleTopicFormNext={this.handleTopicFormNext}
            onTopicSlide={this.onTopicSlide}
            handleTopicFormSubmit={this.handleTopicFormSubmit}
          />
        </div>
      </PageModal>
    );
  }
});

export default SubtopicFormPage;
