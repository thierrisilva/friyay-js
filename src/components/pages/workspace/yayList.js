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

class YayList extends Component {
  static propTypes = {
    domain: PropTypes.object,
    parentCard: PropTypes.object,
    selectedYay: PropTypes.object,
    onSelectYay: PropTypes.func,
    handleReorder: PropTypes.func,
    topicOrder: PropTypes.object
  };

  state = {
    yays: {},
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

  loadYays(domain) {
    const { parentCard } = this.props;
    let resource = 'topics?with_permissions=true';
    if (parentCard) {
      resource = `${resource}&parent_id=${parentCard.id}`;
    }
    APIRequest.get({
      resource,
      domain
    })
      .done(response => {
        this.setState({
          yays: {
            ...this.state.yays,
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

  componentDidMount() {
    const { domain } = this.props;
    if (domain && !this.state.yays[this.generateId()]) {
      this.loadYays(domain);
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.domain && !this.props.domain) {
      return;
    }
    if (!prevProps.domain || prevProps.domain.id !== this.props.domain.id) {
      if (!this.state.yays[this.generateId()]) {
        this.loadYays(this.props.domain);
      }
    }
    if (!this.props.parentCard) {
      return;
    }
    if (
      !prevProps.parentCard ||
      prevProps.parentCard.id !== this.props.parentCard.id
    ) {
      if (!this.state.yays[this.generateId()]) {
        this.loadYays(this.props.domain);
      }
    }
  }

  get cardsInOrder() {
    const { topicOrder } = this.props;
    const { yays } = this.state;
    let orderCards = [...(yays[this.generateId()] || [])];
    if (!topicOrder) return orderCards;
    topicOrder.attributes.subtopic_order.forEach((tipId, idx) => {
      const index = orderCards.map(o => o.id).indexOf(tipId);
      if (index > 0) {
        const card = orderCards.splice(index, 1);
        orderCards.splice(idx, 0, card[0]);
      }
    });
    return orderCards;
  }

  handleTitleChange = ({ target }) => {
    this.setState({ title: target.value });
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const data = {
        data: {
          type: 'topic',
          attributes: {
            title: this.state.title
          }
        }
      };
      if (this.props.parentCard) {
        data.data.attributes['parent_id'] = this.props.parentCard.id;
      }
      this.setState({ isFormOpen: !this.state.isFormOpen });
      APIRequest.post({
        resource: 'topics',
        domain: this.props.domain,
        data
      }).done(response => {
        this.setState({
          yays: {
            ...this.state.yays,
            [this.generateId()]: this.state.yays[this.generateId()].concat(
              response.data
            )
          }
        });
      });
    }
  };

  handleDrop = ({ dropZoneProps, draggedItemProps }) => {
    APIRequest.get({
      resource: `topics/${dropZoneProps.item.id}`,
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
        resource: `topics/${response.data.id}`,
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

  onEditCard = yay => value => {
    APIRequest.patch({
      resource: `topics/${yay.id}`,
      domain: this.props.domain,
      data: {
        data: {
          ...yay,
          attributes: {
            ...yay.attributes,
            title: value
          }
        }
      }
    });
  };

  render() {
    const { isFormOpen, title } = this.state;
    const {
      domain,
      selectedYay,
      onSelectYay,
      parentCard,
      handleReorder
    } = this.props;
    return (
      <Fragment>
        {domain && (
          <GenericDragDropListing
            dragClassName="flex-1"
            dropZoneProps={{ type: dragItemTypes.TOPIC, parentCard }}
            draggedItemProps={{
              origin: { topicId: parentCard ? parentCard.id : null }
            }}
            itemContainerClassName="ws-item"
            itemList={this.cardsInOrder}
            itemType={dragItemTypes.TOPIC}
            onDropItem={handleReorder}
            renderItem={yay => (
              <GenericDropZone
                key={yay.id}
                itemType={[dragItemTypes.PERSON, dragItemTypes.TEAM]}
                onDrop={this.handleDrop}
                item={yay}
              >
                <ListItem
                  key={yay.id}
                  text={yay.attributes.title}
                  selected={selectedYay && yay.id === selectedYay.id}
                  logo="square"
                  fontAwesome
                  additionalClasses="rectangle-icon"
                  onEdit={this.onEditCard(yay)}
                  onExpand={() => onSelectYay && onSelectYay(yay)}
                  url={`${generateUrl(domain)}/yays/${yay.attributes.slug}`}
                  itemType={dragItemTypes.TOPIC}
                  item={yay}
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
          {isFormOpen ? 'Cancel' : '+Add yay'}
        </div>
      </Fragment>
    );
  }
}

export default YayList;
