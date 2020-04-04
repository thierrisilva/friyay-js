import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import IconButton from 'Components/shared/buttons/IconButton';
import CardTopicLink from 'Components/shared/cards/elements/CardTopicLink';
import LabelIndicatorBar from 'Components/shared/labels/elements/LabelIndicatorBar';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import GridCardAttachmentDropOptions from 'Components/views/card_views/Grid/GridCardAttachmentDropOptions';
import { nestCardUnderCard } from 'Src/newRedux/database/cards/thunks';
import GenericCard from 'Components/views/card_views/GenericCard';
import GridFooter from 'Components/views/card_views/Grid/GridFooter';

class SmallGridCard extends GenericCard {
  static propTypes = {
    card: PropTypes.object
  };

  state = {
    isAttachmentHoveringOnCard: false,
    showNestedCards: false,
    showNewCardInput: false,
    card: this.props.card,
    draggedCard: null
  };

  toggleAttachmentHoveringOnCard = status => {
    this.setState(prevState => ({
      ...prevState,
      isAttachmentHoveringOnCard: status
    }));
  };

  handleNewCardInputButtonClick = () => {
    this.setState({
      showNestedCards: true,
      showNewCardInput: !this.state.showNewCardInput
    });
  };

  render() {
    const { card, topic, level } = this.props;
    const { isAttachmentHoveringOnCard, showNewCardInput } = this.state;
    const {
      relationships: {
        labels: { data: labels },
        nested_tips: { data: nested_tips }
      }
    } = card;

    return (
      <Fragment>
        <div className="small-grid-card">
          {isAttachmentHoveringOnCard ? (
            <GridCardAttachmentDropOptions card={card} view="smallgrid-view" />
          ) : (
            [
              <GenericDropZone
                dropClassName="small-grid-card-dropzone"
                onDragEnter={() => this.toggleAttachmentHoveringOnCard(true)}
                onDragLeave={() => this.toggleAttachmentHoveringOnCard(false)}
                dropsDisabled
                itemType={dragItemTypes.FILE}
                key="swap-zone"
              >
                <LabelIndicatorBar
                  key="small-grid-card-label"
                  labelIds={card.relationships.labels.data}
                />
                <div
                  key={`small-grid-top-${card.id}`}
                  className="small-grid-card_section"
                >
                  <div className="flex-1">
                    <CardTopicLink card={card} fullPath />
                  </div>
                  <CardActionsDropdown
                    card={card}
                    onAddCard={this.handleNewCardInputButtonClick}
                  />
                </div>
              </GenericDropZone>,
              <div
                key={`card_section${card.id} title`}
                className="small-grid-card_section title"
              >
                {!level && (
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
                        additionalClasses="smallgrid-card__nested-cards-caret"
                        fontAwesome
                        icon={
                          this.state.showNestedCards
                            ? 'caret-down'
                            : 'caret-left'
                        }
                        onClick={this.handleNestedCardsCaretClick}
                      />
                    </div>
                  </GenericDropZone>
                )}
                <CardTitleLink maxLines={3} size="xl" card={card} />
              </div>,
              <div key={`small-grid-addcard-${card.id}`}>
                {showNewCardInput && (
                  <AddCardCard
                    cardStyle={{
                      marginLeft: '10px',
                      marginTop: '10px'
                    }}
                    inInputMode
                    newCardRelationships={{ follows_tip: { data: card.id } }}
                    topicId={topic.id}
                    onDismiss={this.handleNewCardInputButtonClick}
                  />
                )}
              </div>,
              <div className="nested-card-summary" key="nested-card-summary">
                {this.state.showNestedCards &&
                  `Contains ${nested_tips.length} nested cards`}
                {this.state.draggedCard &&
                  `. Drop here to nest ${
                    this.state.draggedCard.attributes.title
                  }`}
              </div>,
              <GridFooter key={card.id} item={card} labels={labels} />
            ]
          )}
        </div>
      </Fragment>
    );
  }
}

const mapState = state => {
  return state;
};

const mapDispatch = {
  nestCardUnderCard
};

export default connect(
  mapState,
  mapDispatch
)(SmallGridCard);
