import classNames from 'classnames';
import React, { Fragment } from 'react';
import get from 'lodash/get';
import { array, bool, func, number, object, string } from 'prop-types';
import { connect } from 'react-redux';

import AddCardCard from 'Components/shared/cards/AddCardCard';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import IconButton from 'Components/shared/buttons/IconButton';
import { sheetConfig } from './sheetConfig/index';
import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import {
  nestCardUnderCard as nestCardUnderCardAction,
  updateCard
} from 'Src/newRedux/database/cards/thunks';
import { setEditCardModalOpen } from 'Src/newRedux/interface/modals/actions';
import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import GenericCard from 'Components/views/card_views/GenericCard';
import { stateMappings } from 'Src/newRedux/stateMappings';

class SheetCard extends GenericCard {
  static defaultProps = { dragLeaveHandlersForParentLists: [] };

  static propTypes = {
    allCardsHash: object.isRequired,
    card: object.isRequired,
    columns: array.isRequired,
    configureColumns: bool.isRequired,
    dragLeaveHandlersForParentLists: array,
    level: number.isRequired,
    nestCardUnderCard: func.isRequired,
    topicId: string,
    updateCard: func.isRequired
  };

  state = {
    isEditing: false,
    showNestedCards: !!get(
      this.props.card,
      'relationships.nested_tips.data.length'
    ),
    showNewCardInput: false,
    title: ''
  };

  handleDropCard = ({ droppedItemProps, dropZoneProps, itemOrder }) => {
    this.props.nestCardUnderCard({
      nestedCard: droppedItemProps.item,
      parentCard: this.props.allCardsHash[dropZoneProps.cardId],
      fromTopicId: droppedItemProps.origin.topicId,
      toTopicId: dropZoneProps.topicId,
      itemOrder
    });
  };

  handleNewCardInputButtonClick = () => {
    this.setState({
      showNestedCards: true,
      showNewCardInput: !this.state.showNewCardInput
    });
  };

  handleTitleChange = ev => {
    this.setState({ title: ev.target.value });
  };

  handleTitleKeyDown = ev => {
    if (ev.keyCode === 27) {
      this.handleToggleEditMode();
    }

    if (ev.keyCode === 13) {
      this.handleValueUpdate({
        attributes: { title: ev.target.value }
      });

      this.handleToggleEditMode();
    }
  };

  handleToggleEditMode = () => {
    this.setState({ isEditing: !this.state.isEditing, title: '' });
  };

  handleValueChange(column, value) {
    this.setState({ [column]: value });
  }

  handleValueUpdate(updates) {
    this.props.updateCard({ id: this.props.card.id, ...updates });
  }

  render() {
    const { card, color } = this.props;
    const {
      attributes,
      id: cardId,
      relationships: {
        nested_tips,
        topics: {
          data: [defaultTopicId]
        }
      }
    } = card;

    const nestingLevelPadding = (this.props.level - 1) * 20;
    const nestedCards = nested_tips.data
      .map(nestedCardId => this.props.allCardsHash[nestedCardId])
      .filter(nestedCard => !!nestedCard);

    const title = this.state.title ? this.state.title : attributes.title;

    const titleHeader = document.getElementsByClassName('rw--title');

    return (
      <Fragment>
        <div className="sheet-view__card">
          <div
            className="sheet-view__cell sheet-view__cell--title"
            style={{
              paddingLeft: `${nestingLevelPadding + 7}px`,
              ...(titleHeader[0] && { flexBasis: titleHeader[0].style.width })
            }}
          >
            {this.state.isEditing ? (
              <input
                autoFocus
                className="form-control form-control-minimal sheet-view__card-title-edit"
                value={title}
                onBlur={this.handleToggleEditMode}
                onChange={this.handleTitleChange}
                onKeyDown={this.handleTitleKeyDown}
              />
            ) : (
              <Fragment>
                <div className="sheet-view__card-title">
                  <GenericDropZone
                    dropClassName="nest-card-zone"
                    onDragStart={e => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDragEnter={attrs => this.showAsNestable(attrs)}
                    onDragLeave={attrs => this.dontShowAsNestable(attrs)}
                    itemType={dragItemTypes.CARD}
                    onDrop={this.handleNestCard}
                    key="nest-zone"
                  >
                    <div className="nest-zone">
                      <IconButton
                        additionalClasses="sheet-card__nested-cards-caret dark-grey-icon-button"
                        fontAwesome
                        color={color}
                        icon={
                          this.state.showNestedCards
                            ? 'caret-down'
                            : 'caret-right'
                        }
                        onClick={this.handleNestedCardsCaretClick}
                      />
                    </div>
                  </GenericDropZone>
                  <CardTitleLink card={card} />
                  <IconButton
                    additionalClasses="sheet-view__card-title-edit-btn"
                    fontAwesome
                    icon="pencil"
                    color={color}
                    onClick={this.handleToggleEditMode}
                  />
                  <IconButton
                    additionalClasses="sheet-view__card-nested-cards-add"
                    icon="add"
                    color={color}
                    onClick={this.handleNewCardInputButtonClick}
                  />
                </div>
                <CardActionsDropdown
                  color={color}
                  card={this.props.card}
                  onAddCard={this.handleNewCardInputButtonClick}
                />
              </Fragment>
            )}
          </div>
          {this.props.columns.map(column => {
            const config = sheetConfig[column] || sheetConfig.default;
            const modifier = config.cssModifier;
            const cellClassNames = classNames('sheet-view__cell', {
              [`sheet-view__cell--${modifier}`]: modifier
            });

            const ColumnComponent = config.Component || null;
            const colHeader = document.getElementsByClassName(
              `rw--${modifier}`
            );

            return (
              <div
                key={column}
                className={cellClassNames}
                style={{
                  ...(colHeader[0] && { flexBasis: colHeader[0].style.width })
                }}
              >
                {ColumnComponent ? (
                  <ColumnComponent
                    card={this.props.card}
                    value={this.state[column]}
                    handleValueChange={this.handleValueChange.bind(
                      this,
                      column
                    )}
                    handleValueUpdate={this.handleValueUpdate.bind(this)}
                    setEditCardModalOpen={this.props.setEditCardModalOpen}
                  />
                ) : (
                  config.render(
                    this.props.card,
                    this.state[column],
                    this.handleValueChange.bind(this, column),
                    this.handleValueUpdate.bind(this)
                  )
                )}
              </div>
            );
          })}
          {this.props.configureColumns && (
            <div className="sheet-view__cell sheet-view__cell--add" />
          )}
        </div>
        {this.state.showNestedCards && (
          <GenericDragDropListing
            draggedItemProps={{ origin: { topicId: this.props, cardId } }}
            dropZoneProps={{ topicId: this.props, cardId }}
            itemList={nestedCards}
            itemType={dragItemTypes.CARD}
            onDropItem={this.handleDropCard}
            parentListDragLeaveHandlers={
              this.props.dragLeaveHandlersForParentLists
            }
            renderItem={(nestedCard, dragHandlers) => (
              <ConnectedSheetCard
                color={color}
                card={nestedCard}
                columns={this.props.columns}
                configureColumns={this.props.configureColumns}
                dragLeaveHandlersForParentLists={dragHandlers}
                key={nestedCard.id}
                level={this.props.level + 1}
                topicId={this.props.topicId || defaultTopicId}
              />
            )}
          >
            {this.state.showNewCardInput && (
              <AddCardCard
                cardStyle={{
                  marginBottom: '10px',
                  paddingLeft: `${nestingLevelPadding + 20}px`
                }}
                inInputMode
                newCardRelationships={{
                  follows_tip: { data: this.props.card.id }
                }}
                topicId={this.props.topicId}
                onDismiss={this.handleNewCardInputButtonClick}
              />
            )}
          </GenericDragDropListing>
        )}
      </Fragment>
    );
  }
}

function mapState(state) {
  const sm = stateMappings(state);

  return { allCardsHash: sm.cards };
}

const mapDispatch = {
  nestCardUnderCard: nestCardUnderCardAction,
  updateCard,
  setEditCardModalOpen
};

const ConnectedSheetCard = connect(
  mapState,
  mapDispatch
)(SheetCard);

export default ConnectedSheetCard;
