import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { array, func, string } from 'prop-types';

import { getTopicFilters } from 'Src/newRedux/filters/selectors';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { toggleTopicFilter as toggleTopicFilterThunk } from 'Src/newRedux/filters/thunks';
import LeftMenuNewTopicInput from '../elements/LeftMenuNewTopicInput';
import LeftMenuTopicSection from '../elements/LeftMenuTopicSection';
import Icon from 'Components/shared/Icon';
import IconButton from 'Components/shared/buttons/IconButton';
import { yayDesign } from 'Src/lib/utilities';

class LeftMenuTopicSegment extends Component {
  static propTypes = {
    currentPath: string.isRequired,
    rootUrl: string.isRequired,
    selectedTopicFilters: array.isRequired,
    toggleTopicFilter: func.isRequired,
    topicFilters: array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      displayAddTopic: false
    };
  }

  componentDidMount() {
    const { topicFilters, toggleTopicFilter } = this.props;
    if (!topicFilters.find(filter => filter.key == 'ALL')) {
      toggleTopicFilter(topicFilters[0].key);
    }
  }

  handleToggleNewTopicInput = () => {
    this.setState(state => ({ displayAddTopic: !state.displayAddTopic }));
  };

  render() {
    const {
      currentPath,
      rootUrl,
      selectedTopicFilters,
      toggleTopicFilter,
      topicFilters,
      active_design = {}
    } = this.props;
    const { displayAddTopic } = this.state;
    const baseUrl = rootUrl == '/' ? '' : rootUrl;
    const topicsUrl = `${baseUrl}/yays`;
    const topicFilterOptions = Object.values(topicFilters);
    const { workspace_font_color } = active_design;

    return (
      <div className="left-menu_content-row flexi">
        <div className="left-menu_content-row-header">
          <Link
            to={topicsUrl}
            className={`${currentPath == topicsUrl ? 'grey-link active' : ''}`}
          >
            <span className="">
              {' '}
              {
                topicFilters.filter(f => f.key === selectedTopicFilters[0])[0]
                  .name
              }{' '}
            </span>
          </Link>
          <div className="dropdown">
            <span
              className="flex-r-center dropdown"
              id="topicDropdopwCaret"
              data-toggle="dropdown"
            >
              <Icon
                color={workspace_font_color}
                additionalClasses="small topics-header_title dark-grey-icon-button"
                fontAwesome
                icon="caret-down"
              />
            </span>
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
          <IconButton
            color={workspace_font_color}
            fontAwesome
            icon="plus"
            onClick={this.handleToggleNewTopicInput}
            additionalClasses="mlauto dark-grey-icon-button"
          />
        </div>

        {displayAddTopic && (
          <LeftMenuNewTopicInput onDismiss={this.handleToggleNewTopicInput} />
        )}

        <LeftMenuTopicSection
          baseUrl={baseUrl}
          level={0}
          topicId="0"
          onDismiss={this.handleToggleNewTopicInput}
        />
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const { routing, page, filters, topics } = sm;
  const active_design = yayDesign(page.topicId, topics[page.topicId]);

  return {
    active_design,
    currentPath: routing.routerHistory.location.pathname,
    rootUrl: page.rootUrl,
    selectedTopicFilters: filters.topicFilters,
    topicFilters: getTopicFilters(state)
  };
};

const mapDispatch = { toggleTopicFilter: toggleTopicFilterThunk };

export default connect(
  mapState,
  mapDispatch
)(LeftMenuTopicSegment);
