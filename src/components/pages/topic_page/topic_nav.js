import React from 'react';
import { Link } from 'react-router-dom';
import createClass from 'create-react-class';

var TopicNav = createClass({
  render: function() {
    var topic = this.props.topic;
    var topic_attributes = topic.attributes;
    var subtopics = this.props.subtopics;

    var subtopicItems = [];

    var parentTopic = topic.relationships.parent;
    if (parentTopic && parentTopic.data) {
      var rootTopicItem = (
        <li key={'subtopic-dropdown-' + parentTopic.data.id}>
          <Link to={'/yays/' + parentTopic.data.slug}>
            {'Back to ' + parentTopic.data.title}
          </Link>
        </li>
      );
      subtopicItems.push(rootTopicItem);
    }

    for (var i = 0; i < subtopics.length; i++) {
      var subtopic = subtopics[i];
      var subtopicItem = (
        <li key={'subtopic-dropdown-' + subtopic.id}>
          <Link to={'/yays/' + subtopic.attributes.slug}>
            {subtopic.attributes.title}
          </Link>
        </li>
      );
      subtopicItems.push(subtopicItem);
    }

    return (
      <div className="navbar navbar-inverse" id="topic-nav">
        <div className="container-fluid">
          {/*
            <ul className="nav navbar-nav">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                   aria-expanded="false">{topic_attributes.title} <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  {subtopicItems}
                </ul>
              </li>
            </ul>
          */}

          {/*
            <form className="navbar-form navbar-left search-form" role="search">
              <div className="form-group">
                <input type="text" className="form-control search-input" id="scoped-search-input"
                       placeholder={'Search in ' + topic_attributes.title} />
              </div>
            </form>
          */}
        </div>
      </div>
    );
  }
});

export default TopicNav;
