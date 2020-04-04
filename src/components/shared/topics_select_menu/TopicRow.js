import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconHex from '../../svg_icons/icon_hex';

const TopicRow = props => {
  const {
    topic,
    handleTopicSelect,
    handleTopicClick,
    selected,
    disabled
  } = props;

  const topicRowClass = classNames('list-group-item', { selected, disabled });
  const uid = `topic-select-${topic.id}`;

  return (
    <li className={topicRowClass} key={uid} id={uid} defaultValue={selected}>
      <div
        className="icon-hex-container"
        onClick={e => handleTopicSelect(topic, e)}
      >
        <IconHex
          width="25"
          height="25"
          scaleViewBox={false}
          fill={selected ? '#f2ab13' : '#eee'}
          strokeWidth="0"
        />
      </div>

      <a
        href="javascript:void(0)"
        className="link-menu-topic"
        onClick={e => handleTopicSelect(topic, e)}
      >
        {topic.attributes.title}
      </a>

      <div className="link-menu-subtopics">
        <a
          href="javascript:void(0)"
          className="link-menu-subtopics-right"
          onClick={e => handleTopicClick(topic, e)}
        >
          <i className="fa fa-arrow-right" />
        </a>

        <a href="javascript:void(0)" onClick={e => handleTopicClick(topic, e)}>
          yays
        </a>
      </div>

      <div className="clearfix" />
    </li>
  );
};

TopicRow.propTypes = {
  topic: PropTypes.object.isRequired,
  handleTopicSelect: PropTypes.func.isRequired,
  handleTopicClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired
};

TopicRow.defaultProps = {
  selected: false,
  disabled: false
};

export default TopicRow;
