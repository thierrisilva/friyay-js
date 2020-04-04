import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { topicFilters } from 'Lib/config/filters/topics';
import { toggleTopicFilter } from 'Src/newRedux/filters/thunks';

import Icon from 'Components/shared/Icon';

const topicFilterOptions = Object.values(topicFilters);

class SubtopicFilterDropdown extends Component {
  static propTypes = {
    toggleTopicFilter: PropTypes.func.isRequired
  };

  render() {
    const { selectedTopicFilters, toggleTopicFilter } = this.props;

    return (
      <div className="subtopics-filter">
        <div className="dropdown">
          <a
            className="flex-r-center dropdown"
            id="topicDropdopwCaret"
            data-toggle="dropdown"
          >
            <Icon
              additionalClasses="grey-icon-button current-view"
              fontAwesome
              icon={topicFilters[selectedTopicFilters[0]].icon}
            />
            <Icon
              additionalClasses="grey-icon-button more_vert"
              fontAwesome
              icon="caret-down"
            />
          </a>
          <ul className="dropdown-menu" aria-labelledby="dLabel">
            {topicFilterOptions.map(option => (
              <li key={option.key}>
                <a onClick={() => toggleTopicFilter(option.key, true)}>
                  {option.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);

  return {
    selectedTopicFilters: sm.filters.topicFilters
  };
};

const mapDispatch = {
  toggleTopicFilter
};

export default connect(
  mapState,
  mapDispatch
)(SubtopicFilterDropdown);
