import React from 'react';
import { connect } from 'react-redux';
import { array, func, object } from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';
import get from 'lodash/get';
import { createPeopleOrder } from 'Src/newRedux/database/peopleOrders/thunks';
import {
  getPeopleOrders,
  getSelectedPeopleOrder
} from 'Src/newRedux/database/peopleOrders/selectors';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';

import IconButton from 'Components/shared/buttons/IconButton';
import OrdersMenuRow from '../elements/OrdersMenuRow';

const RightPeopleOrdersMenu = ({
  createPeopleOrder,
  peopleOrders,
  selectedPeopleOrder,
  setRightMenuOpenForMenu,
  topicDefaultPeopleOrderId
}) => {
  const handleCreateOrder = () => {
    createPeopleOrder({});
  };

  const handleSelectDefaultOrder = defaultOrder => {
    for (let index = 0; index < peopleOrders.length; index++) {
      const element = peopleOrders[index];
      if (defaultOrder.id !== element.id) {
        element.attributes.is_default = false;
      }
    }
  };

  return (
    <div className="right-submenu">
      <div className="right-submenu_header">
        <IconButton
          fontAwesome
          icon="caret-left"
          onClick={() => setRightMenuOpenForMenu('Orders')}
        />
        <span className="ml5">Orders</span>
      </div>
      {peopleOrders.map(peopleOrder => (
        <OrdersMenuRow
          isDefault={peopleOrder.id == topicDefaultPeopleOrderId}
          isSelected={selectedPeopleOrder == peopleOrder}
          key={peopleOrder.id}
          order={peopleOrder}
          orderType="people"
          handleSelectDefaultOrder={handleSelectDefaultOrder}
        />
      ))}
      <div className="right-submenu_item option" key={'NEW'}>
        <a className="right-submenu_item no-border" onClick={handleCreateOrder}>
          <span className="ml5">Create New Order</span>
        </a>
      </div>
    </div>
  );
};

RightPeopleOrdersMenu.propTypes = {
  setRightMenuOpenForMenu: func.isRequired,
  peopleOrders: array.isRequired,
  selectedPeopleOrder: object
};

const mapState = state => {
  const sm = stateMappings(state);
  const topic = sm.page.topicId ? sm.topics[sm.page.topicId] : null;
  return {
    peopleOrders: getPeopleOrders(state),
    selectedPeopleOrder: getSelectedPeopleOrder(state),
    topicDefaultPeopleOrderId: topic
      ? get(topic, 'relationships.people_order.data')
      : null
  };
};

const mapDispatch = {
  createPeopleOrder,
  setRightMenuOpenForMenu
};

export default connect(
  mapState,
  mapDispatch
)(RightPeopleOrdersMenu);
