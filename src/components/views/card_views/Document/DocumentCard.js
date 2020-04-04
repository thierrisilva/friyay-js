import classNames from 'classnames';
import moment from 'moment';
import React, { Fragment } from 'react';
import { array, func, number, object, string } from 'prop-types';
import { connect } from 'react-redux';

import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import DocumentIcon from 'Components/shared/documents/document_icon';
import IconButton from 'Components/shared/buttons/IconButton';
import tiphive from 'Lib/tiphive';
import UserAvatar from 'Components/shared/users/elements/UserAvatar';
import {
  dragItemTypes,
  GenericDragDropListing
} from 'Components/shared/drag_and_drop/_index';
import { nestCardUnderCard as nestCardUnderCardAction } from 'Src/newRedux/database/cards/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import DocumentCardAttachmentDropOptions from './DocumentCardAttachmentDropOptions';
import GenericCard from 'Components/views/card_views/GenericCard';

class DocumentCard extends GenericCard {
  static defaultProps = { level: 0 };

  static propTypes = {
    allCardsHash: object.isRequired,
    card: object.isRequired,
    dragLeaveHandlersForParentLists: array,
    level: number,
    nestCardUnderCard: func.isRequired,
    onAddDocument: func.isRequired,
    topicId: string, //.isRequired,
    color: string
  };

  state = {
    showNestedCards: false,
    isAttachmentHoveringOnCard: false,
    showNewCardInput: false
  };

  handleAddDocument = () => {
    const { card, onAddDocument } = this.props;

    onAddDocument({ cardId: card.id, tab: 'Edit', openFileUploader: true });
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

  toggleAttachmentHoveringOnCard = status => {
    this.setState(prevState => ({
      ...prevState,
      isAttachmentHoveringOnCard: status
    }));
  };

  render() {
    const { isAttachmentHoveringOnCard } = this.state;
    const {
      allCardsHash,
      card: {
        attributes: {
          attachments_json: { documents = [] }
        },
        id: cardId,
        relationships: {
          nested_tips,
          topics: {
            data: [defaultTopicId]
          }
        }
      },
      card,
      dragLeaveHandlersForParentLists,
      level,
      onAddDocument,
      topicId,
      color
    } = this.props;

    const className = classNames('document-card', {
      'show-caret': !this.state.showNestedCards
    });

    const levelMargin = level * 20 + 7;

    const nestedCards = nested_tips.data
      .map(nestedCardId => allCardsHash[nestedCardId])
      .filter(nestedCard => !!nestedCard);

    return (
      <Fragment>
        <div className={className}>
          <div className="document-card__wrapper">
            <div className="document-card_element title">
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
                    additionalClasses="document-card__nested-cards-caret dark-grey-icon-button"
                    fontAwesome
                    icon={
                      this.state.showNestedCards ? 'caret-down' : 'caret-right'
                    }
                    color={color}
                    onClick={this.handleNestedCardsCaretClick}
                  />
                </div>
              </GenericDropZone>
              <CardTitleLink card={card} />
              <IconButton
                additionalClasses="document-card__nested-cards-add"
                icon="add"
                color={color}
                onClick={this.handleNewCardInputButtonClick}
              />
            </div>
            <GenericDropZone
              dropClassName="document-card_section"
              onDragEnter={() => this.toggleAttachmentHoveringOnCard(true)}
              onDragLeave={() => this.toggleAttachmentHoveringOnCard(false)}
              dropsDisabled
              itemType={dragItemTypes.FILE}
            >
              {isAttachmentHoveringOnCard ? (
                <DocumentCardAttachmentDropOptions card={card} />
              ) : (
                [
                  <div
                    key="document-card_upload-btn"
                    className="document-card_upload-btn yellow-hover-link"
                    onClick={this.handleAddDocument}
                  >
                    + Upload
                  </div>,
                  <div
                    key="document-card_doc-list"
                    className="document-card_doc-list-container"
                  >
                    {documents.length == 0 && (
                      <div className="document-card_element lighter">
                        No Documents
                      </div>
                    )}
                    {documents.map(doc => (
                      <div className="document-card_doc-row" key={doc.id}>
                        <span className="mr10">
                          <DocumentIcon
                            documentName={tiphive.baseName(doc.file_url)}
                          />
                        </span>
                        <a
                          className="yellow-hover-link document-card_doc-link"
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {tiphive.baseName(doc.file_url)}
                        </a>
                      </div>
                    ))}
                  </div>
                ]
              )}
            </GenericDropZone>
            <div className="document-card_info-section">
              <div className="document-card_element lighter">
                {moment(card.attributes.created_at).format('MMM D, YY')}
              </div>
              <div className="document-card_element">
                <UserAvatar
                  user={card.attributes.creator}
                  extraClass="flex-r-center-center"
                  size={24}
                />
                <CardActionsDropdown
                  color={color}
                  card={card}
                  onAddCard={this.handleNewCardInputButtonClick}
                />
              </div>
            </div>
          </div>
        </div>
        {this.state.showNestedCards && (
          <GenericDragDropListing
            dragClassName="task-view_drag-card"
            draggedItemProps={{ origin: { topicId, cardId } }}
            dropZoneProps={{ topicId, cardId }}
            itemList={nestedCards}
            itemType={dragItemTypes.CARD}
            onDropItem={this.handleDropCard}
            parentListDragLeaveHandlers={dragLeaveHandlersForParentLists}
            renderItem={(nestedCard, dragHandlers) => (
              <ConnectedDocumentCard
                card={nestedCard}
                dragLeaveHandlersForParentLists={dragHandlers}
                key={nestedCard.id}
                level={level + 1}
                onAddDocument={onAddDocument}
                topicId={topicId || defaultTopicId}
              />
            )}
          >
            {this.state.showNewCardInput && (
              <AddCardCard
                cardStyle={{ marginLeft: `${levelMargin + 20 + 20}px` }}
                inInputMode
                newCardRelationships={{ follows_tip: { data: card.id } }}
                topicId={topicId}
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

const mapDispatch = { nestCardUnderCard: nestCardUnderCardAction };

const ConnectedDocumentCard = connect(
  mapState,
  mapDispatch
)(DocumentCard);

export default ConnectedDocumentCard;
