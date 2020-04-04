import React, { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { array, func, object, string } from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';

import { getSortedTopicsByParentTopic } from 'Src/newRedux/database/topics/selectors';
import { moveOrCopyTopicInOrToTopicFromDragAndDrop } from 'Src/newRedux/database/topics/abstractions';
import { setLeftSubtopicMenuOpenForTopic } from 'Src/newRedux/interface/menus/actions';

import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import DMLoader from 'Src/dataManager/components/DMLoader';
import Icon from 'Components/shared/Icon';
import IconButton from 'Components/shared/buttons/IconButton';
import LeftMenuNewTopicInput from './elements/LeftMenuNewTopicInput';
import LeftMenuTopicRow from './elements/LeftMenuTopicRow';
import withDataManager from 'Src/dataManager/components/withDataManager';
import MenuCloseSideBar from 'Components/menus/shared/MenuCloseSideBar';

import TopicPathContainer from 'Components/shared/topics/elements/TopicPathContainer';

const SubtopicPathElement = ({
  baseUrl,
  element,
  isFirst,
  isLast,
  isSelected,
  onAddSubtopic,
  onBackTrack,
  setLeftSubtopicMenuOpenForTopic
}) => (
  <div className="left-subtopic-menu_path-element">
    <Link
      className={`${
        isSelected ? 'grey-link flex-1 active' : 'grey-link flex-1'
      }`}
      to={`${baseUrl}/yays/${element.slug}`}
    >
      {element.title} {!isLast && ' /'}
    </Link>
    {isLast && (
      <div className="flex-r-nowrap">
        {!isFirst && (
          <IconButton fontAwesome icon="arrow-left" onClick={onBackTrack} />
        )}
        <IconButton fontAwesome icon="plus" onClick={onAddSubtopic} />
      </div>
    )}
    {isFirst && (
      <IconButton
        additionalIconClasses="small"
        fontAwesome
        icon="chevron-right"
        onClick={() => setLeftSubtopicMenuOpenForTopic(null)}
      />
    )}
  </div>
);

class LeftSubtopicMenu extends PureComponent {
  static propTypes = {
    moveOrCopyTopicInOrToTopicFromDragAndDrop: func.isRequired,
    pageTopicSlug: string,
    rootUrl: string.isRequired,
    selectedTopic: object,
    subtopics: array.isRequired,
    setLeftSubtopicMenuOpenForTopic: func.isRequired
  };

  state = {
    displayAddTopic: false
  };

  componentWillReceiveProps({ openQuickAddForm }) {
    this.setState({
      displayAddTopic: this.state.displayAddTopic || openQuickAddForm
    });
  }

  handleToggleNewTopicInput = () => {
    this.setState(state => ({ displayAddTopic: !state.displayAddTopic }));
  };

  handleBackTrack = () => {
    const { selectedTopic, setLeftSubtopicMenuOpenForTopic } = this.props;
    const path = selectedTopic.attributes.path;
    const targetPathElement = path[path.length - 2];
    setLeftSubtopicMenuOpenForTopic('' + targetPathElement.id); //for some reason this not a string
  };

  handleExpandToggle = topicId => {
    this.props.setLeftSubtopicMenuOpenForTopic(topicId, true);
  };

  render() {
    const {
      dmLoading,
      moveOrCopyTopicInOrToTopicFromDragAndDrop,
      pageTopicSlug,
      rootUrl,
      selectedTopic,
      subtopics,
      setLeftSubtopicMenuOpenForTopic
    } = this.props;
    const { displayAddTopic } = this.state;
    const baseUrl = rootUrl == '/' ? '' : rootUrl;
    const path = selectedTopic ? selectedTopic.attributes.path : [];

    return (
      <div
        className={`${
          selectedTopic ? 'left-subtopic-menu in-focus' : 'left-subtopic-menu'
        }`}
      >
        {selectedTopic && (
          <Fragment>
            <TopicPathContainer
              topic={selectedTopic}
              renderAncestor={(topic, index) => (
                <SubtopicPathElement
                  baseUrl={baseUrl}
                  element={topic.attributes}
                  key={topic.id}
                  isFirst={index == 0}
                  isLast={index == path.length - 1}
                  isSelected={pageTopicSlug == topic.attributes.slug}
                  onBackTrack={this.handleBackTrack}
                  onAddSubtopic={this.handleToggleNewTopicInput}
                  setLeftSubtopicMenuOpenForTopic={
                    setLeftSubtopicMenuOpenForTopic
                  }
                />
              )}
            />

            {displayAddTopic && (
              <LeftMenuNewTopicInput
                parentTopicId={selectedTopic.id}
                onDismiss={this.handleToggleNewTopicInput}
              />
            )}

            <GenericDragDropListing
              itemList={subtopics}
              dragClassName="left-menu_draggable-subtopic"
              dropClassName="left-menu_content-list"
              draggedItemProps={{ origin: { topicId: selectedTopic.id } }}
              dropZoneProps={{ topicId: selectedTopic.id }}
              itemType={dragItemTypes.TOPIC_LEFT_MENU}
              onDropItem={moveOrCopyTopicInOrToTopicFromDragAndDrop}
              renderItem={subtopic => (
                <LeftMenuTopicRow
                  baseUrl={baseUrl}
                  key={subtopic.id}
                  isSelected={subtopic.slug == pageTopicSlug}
                  onCaretClick={() =>
                    setLeftSubtopicMenuOpenForTopic(subtopic.id)
                  }
                  topic={subtopic}
                  isExpanded={this.state.isExpanded}
                  onExpandToggle={this.handleExpandToggle}
                />
              )}
            >
              <DMLoader
                dataRequirements={{
                  subtopicsForTopic: { topicId: selectedTopic.id }
                }}
                loaderKey="subtopicsForTopic"
              />

              {subtopics.length == 0 && !dmLoading && (
                <div className="mt20 text-center pr15 btn-xs">
                  You can create a yay by clicking on + Add yay link
                </div>
              )}
            </GenericDragDropListing>
          </Fragment>
        )}
        <MenuCloseSideBar
          right
          onClick={() => setLeftSubtopicMenuOpenForTopic(null)}
        />
      </div>
    );
  }
}

const mapState = (state, props) => {
  const sm = stateMappings(state);
  const { openQuickAddForm, topicId } =
    sm.menus.displayLeftSubtopicMenuForTopic || {};
  const selectedTopic = sm.topics[topicId] || null;
  return {
    openQuickAddForm: openQuickAddForm,
    pageTopicSlug: sm.page.topicSlug,
    rootUrl: sm.page.rootUrl,
    selectedTopic: selectedTopic,
    subtopics: selectedTopic
      ? getSortedTopicsByParentTopic(state)[selectedTopic.id] || []
      : []
  };
};

const mapDispatch = {
  moveOrCopyTopicInOrToTopicFromDragAndDrop,
  setLeftSubtopicMenuOpenForTopic
};

const dataRequirements = props => {
  return {
    subtopicsForTopic: {
      topicId: props.selectedTopic ? props.selectedTopic.id : null
    },
    topicWithSlug: {
      topicSlug: props.selectedTopic
        ? props.selectedTopic.attributes.slug
        : null
    }
  };
};

export default withDataManager(dataRequirements, mapState, mapDispatch)(
  LeftSubtopicMenu
);
