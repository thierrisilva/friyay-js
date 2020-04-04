import classNames from 'classnames';
import React from 'react';
import createClass from 'create-react-class';

var ExploreTopicItem = createClass({
  render: function() {
    var topic = this.props.topic;

    var attributes    = topic.attributes;
    var tipsCount     = attributes.tips_count;
    var color_index   = Math.floor((Math.random() * 7) + 1);

    var tipCountText;
    if (tipsCount > 1) {
      tipCountText = tipsCount + ' Cards';
    }

    var topicClass = classNames('panel', 'panel-default', 'topic', 'explore-item', 'topic-item',
      'color-' + color_index);

    return (
      <div className={topicClass} id={'topic-item-' + topic.id}>
        <div className="panel-heading">
          <h3 className="text-center panel-heading-title">
            <a href="javascript:void(0)" className="" data-slug={attributes.slug} onClick={this.props.handleTopicClick}>
              {attributes.title}
            </a>
          </h3>
        </div>
        <div className="panel-body text-center">
          <div className="row hexagon-row">
            <p>{tipCountText}</p>
            <div className="col-sm-4"><div className="hexagon-small"></div></div>
            <div className="col-sm-4"><div className="hexagon-small"></div></div>
            <div className="col-sm-4"><div className="hexagon-small"></div></div>
          </div>
          <a href="javascript:void(0)" className="follow-link" data-topic-id={topic.id}
             onClick={this.props.handleFollowClick}>FOLLOW</a>
        </div>
      </div>
    );
  }
});

export default ExploreTopicItem;
