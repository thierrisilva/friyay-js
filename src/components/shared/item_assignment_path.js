import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StringHelper from '../../helpers/string_helper';
import LinkWithGroups from './link_with_groups';

class ItemAssignmentPath extends Component {
  renderPath() {
    const { item, maxCharacters, group, handleTopicClick } = this.props;
    const { topics, subtopics } = item.relationships;
    const groupID = group && group.id;

    var displayTopic;
    if (subtopics && subtopics.data.length > 0) {
      displayTopic = subtopics.data[subtopics.data.length - 1];
    }

    if (!displayTopic && topics && topics.data.length > 0) {
      displayTopic = topics.data[topics.data.length - 1];
    }

    if (displayTopic) {
      var shortPath = [displayTopic.hive || ''];

      var longPath;
      if (subtopics && subtopics.data.length > 0) {
        longPath = shortPath.concat(displayTopic.title);
      }

      if (longPath) {
        longPath = this.longPathTruncate(longPath, maxCharacters);
      } else {
        shortPath = this.shortPathTruncate(shortPath, maxCharacters);
      }

      var topic, subTopic, delimiter;
      if (longPath) {
        topic = { title: longPath[0], slug: displayTopic.hive_slug };
        subTopic = { title: longPath[1], slug: displayTopic.slug };
        delimiter = ' / ';

        return (
          <span className="item-topic-paths-content">
            <LinkWithGroups
              handleClick={handleTopicClick}
              groupID={groupID}
              url={`/yays/${topic.slug}`}
            >
              {topic.title}
            </LinkWithGroups>
            {delimiter}
            <LinkWithGroups
              handleClick={handleTopicClick}
              groupID={groupID}
              url={`/yays/${subTopic.slug}`}
            >
              {subTopic.title}
            </LinkWithGroups>
          </span>
        );
      } else {
        topic = { title: shortPath[0], slug: displayTopic.hive_slug };

        return (
          <LinkWithGroups
            handleClick={handleTopicClick}
            groupID={groupID}
            url={`/yays/${topic.slug}`}
          >
            {topic.title}
          </LinkWithGroups>
        );
      }
    }
  }

  longPathTruncate(longPath, maxCharacters) {
    if (longPath.join(' > ').length > maxCharacters) {
      if (longPath[1].length > maxCharacters / 2 + 6) {
        // try subhive only
        longPath[1] = StringHelper.truncate(longPath[1], maxCharacters / 2);
      } else {
        // truncate both
        longPath = longPath.map(topic =>
          StringHelper.truncate(topic, maxCharacters / 2)
        );
      }

      if (longPath.join(' > ').length > maxCharacters) {
        if (longPath[0].length > maxCharacters / 2 + 6) {
          // try subhive only
          longPath[0] = StringHelper.truncate(longPath[0], maxCharacters / 2);
        }
      }
    }

    return longPath;
  }

  shortPathTruncate(shortPath, maxCharacters) {
    // only one path element
    if (shortPath[0].length > maxCharacters) {
      shortPath[0] = StringHelper.truncate(shortPath[0], maxCharacters);
    }

    return shortPath;
  }

  render() {
    const { preText } = this.props;

    return (
      <span className="item-topic">
        <span className="item-user-leader">{preText}</span>
        {this.renderPath()}
      </span>
    );
  }
}

ItemAssignmentPath.propTypes = {
  preText: PropTypes.string,
  item: PropTypes.object,
  maxCharacters: PropTypes.number,
  group: PropTypes.object,
  handleTopicClick: PropTypes.func
};

export default ItemAssignmentPath;
