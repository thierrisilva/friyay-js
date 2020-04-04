import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import { VIEWS_ENUM as VIEWS } from 'Enums';
import {
  togglePanel,
  selectCardViewForTopic,
  selectGridViewForTopic,
  selectListViewForTopic,
  selectSmallGridViewForTopic,
  selectTaskViewForTopic,
  selectViewForAll
} from 'Actions/tipsView';
import { updateTopicView } from 'Actions/topic';
import Ability from 'Lib/ability';
import { toggleLabelsPanel } from 'Actions/labelsPanel';
import { connect } from 'react-redux';

class TopicViewFilter extends Component {
  static propTypes = {
    // showTopicFilterView: PropTypes.bool,
    topic: PropTypes.object,
    selectCard: PropTypes.func.isRequired,
    selectList: PropTypes.func.isRequired,
    selectGrid: PropTypes.func.isRequired,
    selectSmallGrid: PropTypes.func.isRequired,
    selectTask: PropTypes.func.isRequired,
    selectDocuments: PropTypes.func.isRequired,
    selectTodo: PropTypes.func.isRequired,
    toggleTopicPanel: PropTypes.func.isRequired,
    toggleLabelPanel: PropTypes.func.isRequired,
    setAllTopics: PropTypes.func.isRequired,
    view: PropTypes.number,
    updateView: PropTypes.func.isRequired,
    selectWiki: PropTypes.func.isRequired
  };

  static defaultProps = {
    topic: null
  };

  setAll = view => {
    this.props.setAllTopics(view);
  };

  setDefaultView = view => {
    const {
      props: { topic, updateView }
    } = this;
    if (topic !== null) {
      updateView(topic.id, view);
    }
  };

  getItems = () => {
    const {
      props: {
        topic,
        selectCard,
        selectGrid,
        selectList,
        selectSmallGrid,
        selectTask,
        selectDocuments,
        selectTodo,
        selectWiki
      }
    } = this;

    const id = topic !== null ? topic.id : null;

    return [
      {
        name: VIEWS.GRID,
        iconClass: 'view_module',
        tooltip: 'Grid View',
        text: 'Notes',
        action: () => id !== null && selectGrid(id)
      },
      {
        name: VIEWS.LIST,
        iconClass: 'view_stream',
        tooltip: 'List View',
        text: 'List',
        action: () => id !== null && selectList(id)
      },
      {
        name: VIEWS.CARD,
        iconClass: 'view_quilt',
        tooltip: 'Card View',
        text: 'Card',
        action: () => id !== null && selectCard(id)
      },
      {
        name: VIEWS.TASK,
        iconClass: 'view_day',
        tooltip: 'Task View',
        text: 'Task',
        action: () => id !== null && selectTask(id)
      },
      {
        name: VIEWS.WIKI,
        iconClass: 'view_column',
        tooltip: 'Wiki View',
        text: 'Wiki',
        action: () => id !== null && selectWiki(id)
      },
      {
        name: VIEWS.SMALL_GRID,
        iconClass: 'apps',
        tooltip: 'Small Notes View',
        text: 'Small Notes',
        action: () => id !== null && selectSmallGrid(id)
      },
      {
        name: VIEWS.TODO,
        iconClass: 'view_column',
        tooltip: 'Todo View',
        text: 'Todo',
        action: () => id !== null && selectTodo(id)
      },
      {
        name: VIEWS.DOCUMENTS,
        iconClass: 'chrome_reader_mode',
        tooltip: 'Documents View',
        text: 'Documents',
        action: () => id !== null && selectDocuments(id)
      }
    ];
  };

  render() {
    const {
      props: { showTopicFilterView, topic, view, toggleTopicPanel }
    } = this;

    const defaultView =
      topic !== null ? topic.attributes.default_view_id : null;

    const topicViewClass = classNames({
      'topic-view-filter': true,
      show: showTopicFilterView
    });

    return (
      <div className={topicViewClass}>
        <div className="flex-c-start-spacebetween full-height">
          <article className="full-width">
            <div className="flex-c mt10">
              <a
                onClick={toggleTopicPanel}
                className="mb15 close-topic-view-filter"
              >
                <i className="fa fa-chevron-right" />
              </a>
              <label className="mb10" style={{ textTransform: 'uppercase' }}>
                My View :
              </label>
            </div>
            <div className="flex-c mt20">
              {this.getItems().map(viewIcon => (
                <div
                  key={`topic_view_item_${viewIcon.name}`}
                  className={classNames({
                    'mb10 flex-r-center': true,
                    active: view === viewIcon.name
                  })}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="flex-r-center"
                    onClick={() => viewIcon.action()}
                  >
                    <span className="material-icons mr10">
                      {viewIcon.iconClass}
                    </span>{' '}
                    {viewIcon.text}
                  </div>
                  <div
                    className="flex-r-center-end"
                    style={{ marginLeft: 'auto' }}
                  >
                    {viewIcon.name === defaultView && (
                      <span className="badge">Default View</span>
                    )}
                    <span className="navbar-right dropdown">
                      <button
                        className="btn btn-link"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        style={{ color: 'silver', lineHeight: 1 }}
                      >
                        <i className="material-icons">more_vert</i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <a
                            onClick={() => this.setAll(viewIcon.name)}
                            style={{ color: '#222' }}
                          >
                            Apply this view to all my yays
                          </a>
                        </li>
                        {topic !== null &&
                          Ability.can('update', 'self', topic) && (
                            <li>
                              <a
                                onClick={() =>
                                  this.setDefaultView(viewIcon.name)
                                }
                                style={{ color: '#222' }}
                              >
                                Make default view
                              </a>
                            </li>
                          )}
                      </ul>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    );
  }
}

const mapState = ({ labelsPanel: { isVisible } }) => ({
  isVisible
});

const mapDispatch = {
  selectCard: selectCardViewForTopic,
  selectGrid: selectGridViewForTopic,
  selectList: selectListViewForTopic,
  selectSmallGrid: selectSmallGridViewForTopic,
  selectTask: selectTaskViewForTopic,
  toggleTopicPanel: togglePanel,
  toggleLabelPanel: toggleLabelsPanel,
  setAllTopics: selectViewForAll,
  updateView: updateTopicView
};

export default connect(
  mapState,
  mapDispatch
)(withRouter(TopicViewFilter));
