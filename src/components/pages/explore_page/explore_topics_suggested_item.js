import React from 'react';
import classNames from 'classnames';
import createClass from 'create-react-class';

var ExploreTopicSuggestedItem = createClass({
  handleSuggestedTopicCreateClick: function(e) {
    e.preventDefault();
    var suggestedTopic = this.props.suggestedTopic;

    this.props.handleSuggestedTopicCreate(suggestedTopic);
  },

  render: function() {
    var suggestedTopic = this.props.suggestedTopic;

    var attributes  = suggestedTopic.attributes;
    var color_index = Math.floor((Math.random() * 7) + 1);

    var topicClass = classNames('panel', 'panel-default', 'topic', 'explore-item', 'topic-item', 'topic-suggested-item',
      'color-' + color_index);

    return (
      <div className={topicClass} id={'topic-suggested-item-' + suggestedTopic.id}>
        <div className="panel-heading">
          <h3 className="text-center panel-heading-title">
            <a href="javascript:void(0)">{attributes.title}</a>
          </h3>
        </div>
        <div className="panel-body text-center">
          <div className="row hexagon-row">
            <p>&nbsp;</p>
            <div className="col-sm-4"><div className="hexagon-small"></div></div>
            <div className="col-sm-4"><div className="hexagon-small"></div></div>
            <div className="col-sm-4"><div className="hexagon-small"></div></div>
          </div>
          <a href="javascript:void(0)" className="follow-link" data-suggested-topic-id={suggestedTopic.id}
             onClick={this.handleSuggestedTopicCreateClick}>CREATE</a>
        </div>
      </div>
    );
  }
});

export default ExploreTopicSuggestedItem;
