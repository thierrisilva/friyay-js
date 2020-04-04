import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import GenericDropZone from 'Components/shared/drag_and_drop/GenericDropZone';
import TopicActionsDropdown from 'Components/shared/topics/elements/TopicActionsDropdown';
import TopicTitleEditor from 'Src/components/shared/topics/elements/TopicTitleEditor';
import TopicTitleLink from 'Src/components/shared/topics/elements/TopicTitleLink';
import { sheetConfig } from './sheetConfig/index';
import AddCardOrSubtopic from 'Components/shared/assemblies/AddCardOrSubtopic';
import IconButton from 'Components/shared/buttons/IconButton';
import { moveTopicContents } from 'Src/newRedux/database/topics/thunks';

class SheetTopicHeader extends Component {
  static propTypes = {
    cards: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    configureColumns: PropTypes.bool.isRequired,
    isExpanded: PropTypes.bool,
    level: PropTypes.number.isRequired,
    topic: PropTypes.object.isRequired,
    onAddCardOrSubtopic: PropTypes.func.isRequired,
    onTopicExpand: PropTypes.func.isRequired
  };

  state = { isEditing: false };

  handleToggleEditMode = () => {
    this.setState({ isEditing: !this.state.isEditing });
  };

  handleDrop = itemProps => {
    if (itemProps.draggedItemProps.itemType === dragItemTypes.TOPIC) {
      if (itemProps.draggedItemProps.item.id !== this.props.topic.id) {
        this.props.moveTopicContents({
          destinationTopicId: this.props.topic.id,
          topicId: itemProps.draggedItemProps.item.id
        });
      }
    }
  };

  render() {
    const {
      level,
      topic,
      isExpanded,
      onTopicExpand,
      color = { color }
    } = this.props;

    return (
      <GenericDropZone
        dropsDisabled
        itemType={[dragItemTypes.CARD]}
        onDragEnter={() => onTopicExpand(topic.id)}
      >
        <div className="sheet-view__topic-header">
          <div
            className="sheet-view__cell sheet-view__cell--title"
            style={{ paddingLeft: `${(level - 1) * 20 + 7}px` }}
          >
            {this.state.isEditing ? (
              <TopicTitleEditor
                topic={topic}
                onFinishEditing={this.handleToggleEditMode}
              />
            ) : (
              <Fragment>
                <div className="sheet-view__title-wrapper">
                  <GenericDropZone
                    dropClassName="nest-card-zone"
                    onDragStart={e => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    itemType={dragItemTypes.TOPIC}
                    onDrop={this.handleDrop}
                    key="nest-zone"
                  >
                    <div className="nest-zone">
                      <IconButton
                        color={color}
                        additionalClasses="sheet-card__nested-cards-caret dark-grey-icon-button"
                        fontAwesome
                        icon={isExpanded ? 'caret-down' : 'caret-right'}
                        onClick={() => onTopicExpand(topic.id)}
                      />
                    </div>
                  </GenericDropZone>
                  <TopicTitleLink
                    additionalClasses="sheet-view__topic-title"
                    topic={topic}
                  />
                  <IconButton
                    color={color}
                    additionalClasses="sheet-view__topic-title-edit-btn"
                    fontAwesome
                    icon="pencil"
                    onClick={this.handleToggleEditMode}
                  />
                  <AddCardOrSubtopic
                    color={color}
                    displayAddCardButton
                    displayAddSubtopicButton
                    addBothText=" "
                    topic={topic}
                    handleAddCardOrSubtopic={this.props.onAddCardOrSubtopic}
                  />
                </div>
                <TopicActionsDropdown
                  color={color}
                  topic={topic}
                  onRenameTopicSelected={this.handleToggleEditMode}
                />
              </Fragment>
            )}
          </div>
          {this.props.columns.map(column => {
            // should render empty div when !expanded in order to keep the grid
            const config = sheetConfig[column] || sheetConfig.default;
            const cellClassNames = classNames('sheet-view__cell', {
              [`sheet-view__cell--${config.cssModifier}`]: config.cssModifier
            });

            return (
              <div key={column} className={cellClassNames}>
                {!isExpanded && config.renderSummary(this.props.cards)}
              </div>
            );
          })}
          {this.props.configureColumns && (
            <div className="sheet-view__cell sheet-view__cell--add" />
          )}
        </div>
      </GenericDropZone>
    );
  }
}

const mapState = (state, props) => {
  state.topic = props.topic;
  return state;
};

const mapDispatch = {
  moveTopicContents
};

export default connect(
  mapState,
  mapDispatch
)(SheetTopicHeader);
