import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import GenericDropZone from 'Src/components/shared/drag_and_drop/GenericDropZone.js';
import { dragItemTypes } from 'Components/shared/drag_and_drop/dragTypeEnum';
import AddCardCard from 'Components/shared/cards/AddCardCard';
import CardActionsDropdown from 'Components/shared/cards/elements/CardActionsDropdown';
import CardTitleLink from 'Components/shared/cards/elements/CardTitleLink';
import CardTopicLink from 'Components/shared/cards/elements/CardTopicLink';
import LabelIndicatorBar from 'Components/shared/labels/elements/LabelIndicatorBar';
import IconButton from 'Components/shared/buttons/IconButton';
import ItemLabelsListing from 'Src/components/shared/items_container/grid_item/labels/item_labels_listing.js';
import ItemLabelsForm from 'Src/components/shared/items_container/grid_item/labels/item_label_form.js';
import GridBody from './GridBody';
import GridFooter from './GridFooter';
import { SCREEN } from 'Enums';
import { viewCard } from 'Src/newRedux/database/cards/thunks';
import { stateMappings } from 'Src/newRedux/stateMappings';
import GridCardAttachmentDropOptions from './GridCardAttachmentDropOptions';
import GenericCard from 'Components/views/card_views/GenericCard';

class GridCard extends GenericCard {
  state = {
    data: null,
    screen: SCREEN.ITEM,
    showNestedCards: false,
    isAttachmentHoveringOnCard: false,
    showNewCardInput: false
  };

  switchScreen = (screen, data = null) => {
    this.setState({ screen, data });
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
    const { allCardsHash, card, topic: { id: topicId } = {} } = this.props;
    const {
      data,
      screen,
      showNestedCards,
      isAttachmentHoveringOnCard,
      showNewCardInput
    } = this.state;
    const {
      relationships: {
        labels: { data: labels },
        nested_tips
      }
    } = card;

    let cardContent = null;
    switch (screen) {
      case SCREEN.LABEL_LISTING:
        cardContent = (
          <ItemLabelsListing item={card} switchScreen={this.switchScreen} />
        );
        break;
      case SCREEN.LABEL_FORM:
        cardContent = (
          <ItemLabelsForm
            item={card}
            switchScreen={this.switchScreen}
            label={data}
          />
        );
        break;
      default:
        cardContent = (
          <div>
            <LabelIndicatorBar labelIds={card.relationships.labels.data} />
            <div className="grid-card_section">
              <div className="flex-1">
                <CardTopicLink card={card} fullPath />
              </div>
              <CardActionsDropdown
                card={card}
                onAddCard={this.handleNewCardInputButtonClick}
              />
            </div>
            <div className="grid-card_section">
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
                    additionalClasses="grid-card__nested-cards-caret dark-grey-icon-button"
                    fontAwesome
                    icon={
                      this.state.showNestedCards ? 'caret-down' : 'caret-left'
                    }
                    onClick={this.handleNestedCardsCaretClick}
                  />
                </div>
              </GenericDropZone>
              <CardTitleLink size="xl" card={card} />
            </div>
            <GenericDropZone
              dropClassName="grid-card_section"
              onDragEnter={() => this.toggleAttachmentHoveringOnCard(true)}
              onDragLeave={() => this.toggleAttachmentHoveringOnCard(false)}
              dropsDisabled
              itemType={dragItemTypes.FILE}
            >
              {isAttachmentHoveringOnCard ? (
                <GridCardAttachmentDropOptions card={card} />
              ) : (
                <GridBody item={card} />
              )}
            </GenericDropZone>
            {showNestedCards && (
              <div className="grid-card__nested-cards">
                {nested_tips.data
                  .filter(id => !!allCardsHash[id])
                  .map(id => (
                    <CardTitleLink
                      additionalClasses="grid-card__nested-card"
                      key={id}
                      card={allCardsHash[id]}
                    />
                  ))}
                <AddCardCard
                  cardClassName="grid-card__add-card"
                  newCardRelationships={{ follows_tip: { data: card.id } }}
                  topicId={topicId}
                  view="grid-new"
                  inInputMode={showNewCardInput}
                />
              </div>
            )}
            <GridFooter
              item={card}
              labels={labels}
              switchScreen={this.switchScreen}
            />
          </div>
        );
        break;
    }

    return <div className="grid-card">{cardContent}</div>;
  }
}

function mapState(state) {
  const sm = stateMappings(state);

  return { allCardsHash: sm.cards };
}

const mapDispatch = { viewCard };

export default connect(
  mapState,
  mapDispatch
)(withRouter(GridCard));
