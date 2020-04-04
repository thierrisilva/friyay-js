import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import { topicFilters } from 'Lib/config/filters/topics';
import { toggleTopicFilter } from 'Src/newRedux/filters/thunks';

import Icon from 'Components/shared/Icon';
import SubtopicViewOptionsDropdown from "Src/components/shared/topics/elements/SubtopicViewOptionsDropdown";
import { setTopicPanelView } from "Src/newRedux/interface/menus/thunks";


const topicFilterOptions = Object.values( topicFilters );

class TopicsHeader extends Component {

  static propTypes = {
    toggleTopicFilter: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  render () {
    const { selectedTopicFilters, topicPanelView, toggleTopicFilter } = this.props;
    const subtopicPanelVisible = true;
    return (
      <div className="topics-header" >
        <div className='dropdown'>
          <a className='flex-r-center dropdown' id="topicDropdopwCaret" data-toggle="dropdown" >
            <h3 className='topics-header_title'> { topicFilters[ selectedTopicFilters[ 0 ] ].name } </h3>
            <Icon additionalClasses='large topics-header_title' fontAwesome icon='caret-down' />
          </a>
          <ul className="dropdown-menu" aria-labelledby="dLabel">
            {topicFilterOptions.map(option => (
              <li key={option.key}>
                <a onClick={ () => toggleTopicFilter(option.key, true) }>
                  {option.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
}
      

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const topicPanelView = sm.user.attributes.ui_settings.all_topics_view;
  return {
    selectedTopicFilters: sm.filters.topicFilters,
    topicPanelView: topicPanelView
  }
}

const mapDispatch = {
  setTopicPanelView,
  toggleTopicFilter
}


export default connect( mapState, mapDispatch )( TopicsHeader );
