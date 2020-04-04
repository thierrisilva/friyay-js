import React from 'react';
import classNames from 'classnames';
import LeftMenuTopicActions from '../../../actions/left_menu_topic_actions';
import LeftMenuTopicStore from '../../../stores/left_menu_topic_store';
import createClass from 'create-react-class';

var ExploreTopicItemInput = createClass({
  componentDidMount: function() {
    LeftMenuTopicStore.addEventListener(
      window.TOPIC_CREATE_EVENT,
      this.onTopicCreate
    );
  },

  componentWillUnmount: function() {
    LeftMenuTopicStore.removeEventListener(
      window.TOPIC_CREATE_EVENT,
      this.onTopicCreate
    );
  },

  handleTopicFormSubmit: function(e) {
    e.preventDefault();

    var topicTitle = $('#explore-topic-input-form #topic_title')
      .val()
      .trim();

    LeftMenuTopicActions.create(topicTitle, null);
  },

  onTopicCreate: function() {
    $('#explore-topic-input-form #topic_title').val('');
  },

  render: function() {
    var topicClass = classNames(
      'panel',
      'panel-default',
      'topic',
      'explore-item',
      'topic-item',
      'topic-item-input'
    );

    return (
      <div className={topicClass} id={'topic-item-input'}>
        <form
          id="explore-topic-input-form"
          onSubmit={this.handleTopicFormSubmit}
        >
          <div className="panel-heading">
            <h3 className="text-center panel-heading-title">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="topic[title]"
                  id="topic_title"
                  placeholder="Type yay Title"
                  required
                />
              </div>
            </h3>
          </div>
          <div className="panel-body text-center">
            <p>&nbsp;</p>
            <div className="row hexagon-row">
              <div className="col-sm-4">
                <div className="hexagon-small gray" />
              </div>
              <div className="col-sm-4">
                <div className="hexagon-small gray" />
              </div>
              <div className="col-sm-4">
                <div className="hexagon-small gray" />
              </div>
            </div>
            <a
              href="javascript:void(0)"
              className="create-link"
              onClick={this.handleTopicFormSubmit}
            >
              CREATE
            </a>
          </div>
        </form>
      </div>
    );
  }
});

export default ExploreTopicItemInput;
