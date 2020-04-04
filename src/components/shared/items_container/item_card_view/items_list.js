import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import TipDetails from './tip_details';
import Ability from 'Lib/ability';
import TipActionListDropdown from '../list_item/tip_action_list_dropdown';
import UserAvatar from 'Src/components/shared/users/elements/UserAvatar.js';
import CardActionsDropdown from 'Src/components/shared/cards/elements/CardActionsDropdown.js';
import AddCardButton from 'Src/components/shared/buttons/AddCardButton.js';
import DMLoader from 'Src/dataManager/components/DMLoader';
import AddCardCard from 'Components/shared/cards/AddCardCard';

class ItemsList extends Component {

  static propTypes = {
    items: PropTypes.array,
    currentCard: PropTypes.object,
    hideLeftPane: PropTypes.func,
    height: PropTypes.any,
  };

  render() {
    const {
      items,
      height,
      handleItemClick,
      canCreate,
      group,
      topic,
      cardRequirements
    } = this.props

    let { currentCard } = this.props;

    if (currentCard == null ) {
      currentCard = items[0];
    }

    let itemsContent = [];

      itemsContent = items.map(item => {

        const itemClass = classNames({
          'list-item color-4': true,
          'card-active' : currentCard.id === item.id
        });

        return (
          <div className={itemClass} key={item.id}>
            <div className="list-item-content">
              <TipDetails
                group={group}
                item={item}
                handleItemClick={handleItemClick}
              />
              <CardActionsDropdown card={item}/>
            </div>
          </div>
        );
      });

    return (
      <div className="items-list">
            {canCreate && (
              <AddCardButton />
            )}
          <div className="side-panel-container h180" >
            {itemsContent}

            <AddCardCard
              containerClassName="list-item color-4"
              cardClassName="list-item-content"
              topic={topic}
            />

            <div className='full-width'>
              <DMLoader
                dataRequirements={{ cardsWithAttributes: { attributes: cardRequirements }}}
                loaderKey='cardsWithAttributes' />
            </div>

          </div>
      </div>
    );
  };
}


export default ItemsList;
