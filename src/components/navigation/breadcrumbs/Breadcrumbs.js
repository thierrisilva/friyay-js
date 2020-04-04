import React, { Component } from 'react';
import get from 'lodash/get';
import { any, object, string } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';

import BreadcrumbDropdown from './breadcrumb_dropdown';
import WorkspaceDropdown from './workspace_dropdown';
import ErrorBoundary from 'Components/shared/errors/ErrorBoundary';
import TopicPathContainer from 'Components/shared/topics/elements/TopicPathContainer';
import { getThisDomain } from 'Lib/utilities';
import { getDomains } from 'Src/newRedux/database/domains/selectors';
import { getSortedFilteredTopicsForTopic } from 'Src/newRedux/database/topics/selectors';
import { stateMappings } from 'Src/newRedux/stateMappings';

class Breadcrumbs extends Component {
  static propTypes = {
    currentTopic: object,
    domains: any,
    rootUrl: string,
    subtopics: any
  };

  tourPoint = null;

  render() {
    const { currentTopic, domains, rootUrl, subtopics } = this.props;
    const baseUrl = rootUrl == '/' ? rootUrl : rootUrl + '/';

    const {
      attributes: { name: domainName }
    } = getThisDomain(domains);

    return (
      <ErrorBoundary>
        <div className="breadcrumbs">
          <div className="breadcrumb-container">
            <ol
              className="breadcrumb mb0 p0"
              style={{ float: 'left' }}
              id="tour-step-9"
              ref={list => (this.tourPoint = list)}
            >
              <li className="dropdown" key={'topic-breadcrumb-home'}>
                <Link to={baseUrl} className="mr5">
                  <span className="ml10">{domainName}</span>
                </Link>
                <WorkspaceDropdown domains={domains} />
              </li>
              {currentTopic && (
                <li className="dropdown" key={'topic-breadcrumb-topics'}>
                  <Link to={`${baseUrl}yays`} className="mr5">
                    <span className="ml10">yays</span>
                  </Link>
                </li>
              )}
              {currentTopic && (
                <TopicPathContainer
                  topic={currentTopic}
                  renderAncestor={(topic, index) => (
                    <li className="dropdown" key={topic.id}>
                      <Link
                        to={`${baseUrl}yays/${topic.attributes.slug}`}
                        className={`mr5 ${
                          index ===
                          get(currentTopic, 'attributes.path', []).length - 1
                            ? 'breadcrumbs-yay-active'
                            : `${index}-${currentTopic.length}`
                        }`}
                      >
                        <span className="ml2">{topic.attributes.title}</span>
                      </Link>
                      <BreadcrumbDropdown
                        parentTopicId={get(topic, 'attributes.parent_id')}
                        topicId={topic.id}
                        topics={subtopics}
                      />
                    </li>
                  )}
                />
              )}
              <li
                className="dropdown mega-dropdown"
                key={'topic-breadcrumb-select-hive'}
              >
                <a className="mr5">Select yay</a>
                <BreadcrumbDropdown
                  parentTopicId={currentTopic ? currentTopic.id : null}
                  topics={subtopics}
                />
              </li>
            </ol>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

const breadCrumbPathMap = createSelector(
  (state, topic) => (topic ? topic.attributes.path || [] : []),
  state => state,
  (topicPath, state) =>
    topicPath.map((pathElement, index) => {
      const parentTopicId = topicPath[index - 1]
        ? topicPath[index - 1].id
        : null;
      return {
        id: pathElement.id,
        parentTopicId: parentTopicId,
        slug: pathElement.slug,
        title: pathElement.title,
        topics: getSortedFilteredTopicsForTopic(state, parentTopicId)
      };
    })
);

const mapState = state => {
  const sm = stateMappings(state);
  const currentTopic = sm.topics[sm.page.topicId];

  return {
    breadCrumbPathMap: breadCrumbPathMap(state, currentTopic),
    currentTopic: currentTopic,
    domains: getDomains(state),
    page: sm.page.page,
    rootUrl: sm.page.rootUrl,
    subtopics: getSortedFilteredTopicsForTopic(
      state,
      currentTopic ? currentTopic.id : null
    )
  };
};

export default connect(mapState)(Breadcrumbs);
