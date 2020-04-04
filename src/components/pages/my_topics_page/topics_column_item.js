import React from 'react';
import classNames from 'classnames';
import createClass from 'create-react-class';

var TopicsColumnItem = createClass({
  render: function() {
    var topic = this.props.topic;
    var topic_slug = topic.attributes.slug;
    var listClassName = classNames('list-group-item', 'column-topic-item', {active: false});

    return (
      <li className={listClassName} id={'column-topic-' + topic.id} key={topic.id}>
        <a href="javascript:void(0)" ref="menuLink" data-slug={topic_slug} data-topic-id={topic.id}
           onClick={this.props.handleTopicsColumnItemClick}>
          {topic.attributes.title}
        </a>
      </li>
    );
  }
});

export default TopicsColumnItem;
