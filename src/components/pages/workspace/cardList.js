import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ListItem from './listItem';
import APIRequest from 'Lib/ApiRequest';
import {
  dragItemTypes,
  GenericDropZone
} from 'Src/components/shared/drag_and_drop/_index';
import GenericDragDropListing from 'Components/shared/drag_and_drop/GenericDragDropListing';
import { generateUrl } from './domainList';

class CardList extends Component {
  static propTypes = {
    domain: PropTypes.object,
    parentCard: PropTypes.object,
    handleReorder: PropTypes.func,
    topicOrder: PropTypes.object
  };

  state = {
    cards: {},
    isFormOpen: false,
    title: ''
  };

  toggleFrom = () => {
    this.setState({ isFormOpen: !this.state.isFormOpen, title: '' });
  };

  generateId() {
    const { domain, parentCard } = this.props;
    if (parentCard) {
      return `${domain.id}${parentCard.id}`;
    }
    return `${domain.id}all`;
  }

  loadCards(domain) {
    const { parentCard } = this.props;
    if (!parentCard) return;
    let resource = `topics/${parentCard.id}/tips`;
    APIRequest.get({
      resource,
      domain
    })
      .done(response => {
        this.setState({
          cards: {
            ...this.state.cards,
            [this.generateId()]: response.data
          }
        });
      })
      .fail(function(xhr, status) {
        if (status !== 'abort') {
          APIRequest.showErrorMessage('Unable to load teams');
        }
      });
  }

  get cardsInOrder() {
    const { topicOrder } = this.props;
    const { cards } = this.state;
    let orderCards = [...(cards[this.generateId()] || [])];
    if (!topicOrder) return orderCards;
    topicOrder.attributes.tip_order.forEach((tipId, idx) => {
      const index = orderCards.map(o => o.id).indexOf(tipId);
      if (index > 0) {
        const card = orderCards.splice(index, 1);
        orderCards.splice(idx, 0, card[0]);
      }
    });
    return orderCards;
  }

  componentDidMount() {
    const { domain } = this.props;
    if (domain && !this.state.cards[this.generateId()]) {
      this.loadCards(domain);
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.domain && !this.props.domain) {
      return;
    }
    if (!prevProps.domain || prevProps.domain.id !== this.props.domain.id) {
      if (!this.state.cards[this.generateId()]) {
        this.loadCards(this.props.domain);
      }
    }
    if (!this.props.parentCard) {
      return;
    }
    if (
      !prevProps.parentCard ||
      prevProps.parentCard.id !== this.props.parentCard.id
    ) {
      if (!this.state.cards[this.generateId()]) {
        this.loadCards(this.props.domain);
      }
    }
  }

  handleTitleChange = ({ target }) => {
    this.setState({ title: target.value });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const data = {
        data: {
          type: 'tips',
          attributes: {
            title: this.state.title
          }
        }
      };
      if (this.props.parentCard) {
        data.data.relationships = {
          subtopics: {
            data: [{ id: this.props.parentCard.id, type: 'topics' }]
          }
        };
      }
      this.setState({ isFormOpen: !this.state.isFormOpen });
      APIRequest.post({
        resource: 'tips',
        domain: this.props.domain,
        data
      }).done(response => {
        this.setState({
          cards: {
            ...this.state.cards,
            [this.generateId()]: this.state.cards[this.generateId()].concat(
              response.data
            )
          }
        });
      });
    }
  };

  handleDrop = ({ dropZoneProps, draggedItemProps }) => {
    APIRequest.get({
      resource: `tips/${dropZoneProps.item.id}`,
      domain: this.props.domain
    }).done(response => {
      const { itemType, item } = draggedItemProps;
      let shareSettings = response.data.relationships.share_settings || {};
      if (itemType == dragItemTypes.TEAM) {
        shareSettings.data = (shareSettings.data || [])
          .map(d => ({ id: d.sharing_object_id, type: d.sharing_object_type }))
          .concat({
            id: item.id,
            type: 'groups'
          });
      } else if (itemType == dragItemTypes.PERSON) {
        shareSettings.data = (shareSettings.data || [])
          .map(d => ({ id: d.sharing_object_id, type: d.sharing_object_type }))
          .concat({
            id: item.id,
            type: 'users'
          });
      }
      APIRequest.patch({
        resource: `tips/${response.data.id}`,
        domain: this.props.domain,
        data: {
          data: {
            ...response.data,
            relationships: {
              ...response.data.relationships,
              share_settings: shareSettings
            }
          }
        }
      });
    });
  };

  onEditCard = card => value => {
    APIRequest.patch({
      resource: `tips/${card.id}`,
      domain: this.props.domain,
      data: {
        data: {
          attributes: {
            ...card.attributes,
            title: value
          },
          type: 'tips'
        }
      }
    });
  };

  render() {
    const { isFormOpen, title } = this.state;
    const { domain, parentCard, handleReorder } = this.props;
    return (
      <Fragment>
        {domain && (
          <GenericDragDropListing
            dragClassName="flex-1"
            dropZoneProps={{
              type: dragItemTypes.CARD,
              parentCard
            }}
            draggedItemProps={{
              origin: { topicId: parentCard ? parentCard.id : null }
            }}
            itemContainerClassName="ws-item"
            itemList={this.cardsInOrder}
            itemType={dragItemTypes.CARD}
            onDropItem={handleReorder}
            renderItem={card => (
              <GenericDropZone
                key={card.id}
                itemType={[dragItemTypes.PERSON, dragItemTypes.TEAM]}
                onDrop={this.handleDrop}
                item={card}
              >
                <ListItem
                  key={card.id}
                  text={card.attributes.title}
                  logo="description"
                  additionalClasses="medium grey"
                  itemType={dragItemTypes.CARD}
                  onEdit={this.onEditCard(card)}
                  item={card}
                  url={`${generateUrl(domain)}/cards/${card.attributes.slug}`}
                />
              </GenericDropZone>
            )}
          />
        )}
        {isFormOpen && (
          <input
            type="text"
            onChange={this.handleTitleChange}
            placeholder="Title"
            onKeyPress={this.handleKeyPress}
            onKeyDown={this.handleKeyPress}
            value={title}
            className="add-subtopic-input flex-item"
            autoFocus
          />
        )}
        <div className="add-item-btn" onClick={this.toggleFrom}>
          {isFormOpen ? 'Cancel' : '+Add Card'}
        </div>
      </Fragment>
    );
  }
}

export default CardList;
