import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { stateMappings } from 'Src/newRedux/stateMappings';
import RowItem from './RowItem';
import Icon from 'Components/shared/Icon';
import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import { moveTopicFromDragAndDrop } from 'Src/newRedux/database/topics/abstractions';
import { createTopic, viewTopic } from 'Src/newRedux/database/topics/thunks';
import TopicViewMenu from 'Src/components/shared/topics/TopicViewMenu';
import { setTopicPanelView } from 'Src/newRedux/interface/menus/thunks';
import SubtopicViewOptionsDropdown from 'Src/components/shared/topics/elements/SubtopicViewOptionsDropdown';
import SubtopicFilterDropdown from 'Src/components/shared/topics/elements/SubtopicFilterOptionsDropdown';
import { getThisDomain } from 'Src/lib/utilities';
import { getDomains } from 'Src/newRedux/database/domains/selectors';
import { setDomainSubtopicsView } from 'Src/newRedux/interface/menus/thunks';
import { yayDesign } from 'Src/lib/utilities';

class RowView extends React.Component {
  static propTypes = {
    topic: PropTypes.object,
    topicMinimized: PropTypes.bool,
    topics: PropTypes.array,
    toggleFollowTopic: PropTypes.func,
    moveTopicFromDragAndDrop: PropTypes.func,
    createTopic: PropTypes.func.isRequired,
    viewTopic: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isShowMore: false,
      isShowForm: false,
      newTopic: ''
    };

    this.createTopic = props.createTopic;
    this.viewTopic = props.viewTopic;
    this.handleClickAddTopic = this.handleClickAddTopic.bind(this);
    this.handleClickMore = this.handleClickMore.bind(this);
    this.handleSubmitNewTopic = this.handleSubmitNewTopic.bind(this);
    this.handleTopicViewSelect = this.handleTopicViewSelect.bind(this);
    this.setTopicPanelView = props.setTopicPanelView;
    this.setDomainSubtopicsView = props.setDomainSubtopicsView;
  }

  componentDidMount() {
    if (this.props.showAddTopicInput === true) {
      this.handleClickAddTopic();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.showAddTopicInput !== prevProps.showAddTopicInput) {
      this.props.showAddTopicInput === true && this.handleClickAddTopic();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown, true);
  }

  /**
   * On click `More` event handler.
   *
   * @param {Event} e
   */
  handleClickMore(e) {
    e.preventDefault();

    this.setState({
      isShowMore: !this.state.isShowMore
    });
  }

  /**
   * On click add yay event handler.
   *
   * @param {Event} e
   */
  handleClickAddTopic(e) {
    e && e.preventDefault();
    this.setState({
      isShowForm: true
    });

    window.addEventListener('keydown', this.handleKeyDown, true);
  }

  /**
   * On submit new topic event handler.
   *
   * @param {Event} e
   */
  handleSubmitNewTopic = async e => {
    e.preventDefault();
    const { topic } = this.props;
    const { target } = e;
    const title = target[0].value;

    this.setState({ isShowForm: false });
    window.removeEventListener('keydown', this.handleKeyDown, true);

    const newTopic = await this.createTopic({
      attributes: {
        title,
        parent_id: topic ? topic.id : null
      }
    });
  };

  /**
   * On escape key pressed event handler.
   */
  handleEscapeKeyPressed = () => {
    this.setState({ isShowForm: false });
    window.removeEventListener('keydown', this.handleKeyDown, true);
  };

  /**
   * On key down event handler
   */
  handleKeyDown = key => {
    (key.keyCode == 27 || key.key == 'Escape') && this.handleEscapeKeyPressed();
  };

  getCurrentDomain = () => {
    const { domains } = this.props;
    const thisDomain = getThisDomain(domains);
    window.currentDomain = thisDomain;

    return thisDomain;
  };

  handleTopicViewSelect = topicViewMode => {
    const { topic } = this.props;
    topic
      ? this.setTopicPanelView(topicViewMode)
      : this.setDomainSubtopicsView(topicViewMode, this.getCurrentDomain());
  };

  /**
   * Render topic bar input form DOM
   *
   * @return {DOM}
   */
  renderTopicBarInput() {
    return (
      <form style={{ width: '100%' }} onSubmit={this.handleSubmitNewTopic}>
        <input
          type="text"
          name="title"
          placeholder={`enter new yay title`}
          className="form-control form-control-minimal"
          autoFocus
        />
      </form>
    );
  }

  render() {
    const {
      topic,
      topics,
      moveTopicFromDragAndDrop,
      active_design
    } = this.props;

    const { isShowMore, isShowForm, subtopicPanelVisible } = this.state;

    return (
      <div>
        <h3 className="subtopic-header-text">
          yays in {topic ? topic.attributes.title : 'Workspace'}
          <span>
            <div
              onClick={this.handleClickAddTopic}
              style={{ cursor: 'pointer' }}
            >
              <i
                style={{ color: active_design.card_font_color }}
                className="glyphicon glyphicon-plus"
              />
            </div>
          </span>
          <TopicViewMenu
            color={active_design.card_font_color}
            topicViewMode="ROW"
            active={subtopicPanelVisible}
          />
          <SubtopicViewOptionsDropdown onSelect={this.handleTopicViewSelect} />
          <SubtopicFilterDropdown />
        </h3>
        <div className="topic-row-container-root">
          <div
            className="topic-row-container special"
            style={
              isShowForm
                ? {
                    width: '288px',
                    transition: 'width 0.33s ease-in',
                    float: 'left',
                    marginLeft: '25px'
                  }
                : {}
            }
          >
            {isShowForm && this.renderTopicBarInput()}
          </div>
          <div className="topic-row-container special right">
            <div className="topic-row-item">
              <a onClick={this.handleClickMore}>
                <span>{isShowMore ? 'Less' : 'More'}</span>
                <Icon
                  color={active_design.card_font_color}
                  icon={!isShowMore ? `arrow_drop_down` : `arrow_right`}
                  additionalClasses="medium"
                />
              </a>
            </div>
          </div>
          <GenericDragDropListing
            itemList={topics}
            dropClassName={`topic-row-container ${
              !isShowMore ? 'flex-nowrap' : ''
            } ${isShowForm ? 'shrinked' : ''}`}
            itemContainerClassName={'topic-row-item'}
            dropZoneProps={{ topicId: topic ? topic.id : null }}
            itemType={dragItemTypes.TOPIC}
            onDropItem={moveTopicFromDragAndDrop}
            renderItem={subtopic => (
              <RowItem key={subtopic.id} topic={subtopic} />
            )}
            dragPreview={subtopic => (
              <RowItem key={subtopic.id} topic={subtopic} />
            )}
          />
        </div>
      </div>
    );
  }
}

const mapState = state => {
  const sm = stateMappings(state);
  const { page } = sm;
  const uiSettings = sm.user.attributes.ui_settings;
  const myTopicsView = uiSettings.my_topics_view.find(
    view => view.id === sm.page.topicId
  );
  const subtopicPanelVisible =
    myTopicsView && myTopicsView.subtopic_panel_visible;
  const active_design = yayDesign(page.topicId, sm.topics[page.topicId]);

  return {
    active_design,
    subtopicPanelVisible,
    domains: getDomains(state)
  };
};

const mapDispatch = {
  moveTopicFromDragAndDrop,
  createTopic,
  viewTopic,
  setTopicPanelView,
  setDomainSubtopicsView
};

export default connect(
  mapState,
  mapDispatch
)(RowView);
