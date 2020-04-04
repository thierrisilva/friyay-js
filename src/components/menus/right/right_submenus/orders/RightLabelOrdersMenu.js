import React from 'react';
import { connect } from 'react-redux';
import { array, func, object } from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';
import get from 'lodash/get';
import { createLabelOrder } from 'Src/newRedux/database/labelOrders/thunks';
import {
  getLabelOrders,
  getSelectedLabelOrder
} from 'Src/newRedux/database/labelOrders/selectors';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import IconButton from 'Components/shared/buttons/IconButton';
import OrdersMenuRow from '../elements/OrdersMenuRow';

const RightLabelOrdersMenu = ({
  createLabelOrder,
  labelOrders,
  selectedLabelOrder,
  setRightMenuOpenForMenu,
  topicDefaultLabelOrderId
}) => {
  const handleCreateOrder = () => {
    createLabelOrder({});
  };

  const handleSelectDefaultOrder = defaultOrder => {
    for (let index = 0; index < labelOrders.length; index++) {
      const element = labelOrders[index];
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
        <span className="ml5">Label Orders</span>
      </div>
      {labelOrders.map(labelOrder => (
        <OrdersMenuRow
          isDefault={
            topicDefaultLabelOrderId == labelOrder.id ||
            get(topicDefaultLabelOrderId, 'id') == labelOrder.id
          }
          isSelected={selectedLabelOrder == labelOrder}
          key={labelOrder.id}
          order={labelOrder}
          orderType="label"
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

RightLabelOrdersMenu.propTypes = {
  setRightMenuOpenForMenu: func.isRequired,
  labelOrders: array.isRequired,
  selectedLabelOrder: object,
  createLabelOrder: func
};

const mapState = state => {
  const sm = stateMappings(state);
  const topic = sm.page.topicId ? sm.topics[sm.page.topicId] : null;
  return {
    labelOrders: getLabelOrders(state),
    selectedLabelOrder: getSelectedLabelOrder(state),
    topicDefaultLabelOrderId: topic
      ? get(topic, 'relationships.label_order.data')
      : null
  };
};

const mapDispatch = {
  createLabelOrder,
  setRightMenuOpenForMenu
};

export default connect(
  mapState,
  mapDispatch
)(RightLabelOrdersMenu);
