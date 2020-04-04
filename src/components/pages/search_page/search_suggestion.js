import React from 'react';
import createClass from 'create-react-class';

// this is acting as a pure HTML template, no event handling should be here
var SearchSuggestion = createClass({
  render: function() {

    var label = this.props.label.toUpperCase();
    var resource_type = this.props.resource_type;
    var item = this.props.item;

    if (!item) {
      return (
        <div className="tt-suggestion">
          <a href="javascript:void(0)">
            <span className="item-kind">{label}</span>
            <span className="item-name">*** Unable to read this kind of result {label} #{item.id}</span>
          </a>
        </div>
      );
    }

    var attributes      = item.attributes;
    var name            = attributes.name;
    var slug            = attributes.slug;
    var creatorName     = attributes.creator_name;
    var paths           = attributes.topic_paths;

    // if (!attributes.title) {
    //   name = attributes.name;
    // }

    if (!name) {
      name = '*** Unable to get name for item type ' + label + ' with ID #' + item.id;
    }

    var topicPathsArray = [];
    if (paths) {
      paths.forEach (
        function (pathArray, pIndex, paths) {
          var topicPathString = 'in ' + pathArray.shift();

          if (pathArray.length > 0) {
            pathArray.forEach(
              function (elem, index, array) {
                topicPathString += ' > ';
                topicPathString += elem;
              }
            );
          }

          topicPathsArray.push(topicPathString);
        }
      );
    }

    // var displayTopic;
    // if (item.type === 'tips') {
    //   var subtopics = item.relationships.subtopics;

    //   if (subtopics && subtopics.data.length > 0) {
    //     displayTopic = subtopics.data[subtopics.data.length - 1];
    //   }
    // }

    var topicPath;
    if (resource_type === 'tips') {
      topicPath =
        <span className="item-topics">
          {topicPathsArray[0]} by {creatorName}
        </span>;
    } else if (topicPathsArray.length > 0) {
      topicPath =
        <span className="item-topics">
          {topicPathsArray[0]}
        </span>;
    }

    return (
      <div className="tt-suggestion">
        <a href="javascript:void(0)">
          <span className="item-kind">{label}</span>
          <span className="item-name">{name}</span>
          <span className="item-topics">{topicPath}</span>
        </a>
      </div>
    );
  }
});

export default SearchSuggestion;
