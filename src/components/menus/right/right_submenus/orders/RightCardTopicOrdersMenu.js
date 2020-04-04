import React from 'react';
import { connect } from 'react-redux';
import { array, func } from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';

import {
  getTopicOrdersByTopic,
  getRelevantTopicOrderForTopic
} from 'Src/newRedux/database/topicOrders/selectors';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import {
  createTopicOrder,
  selectTopicOrder
} from 'Src/newRedux/database/topicOrders/thunks';

import IconButton from 'Components/shared/buttons/IconButton';
import OrdersMenuRow from '../elements/OrdersMenuRow';

const RightCardTopicOrdersMenu = ({
  createTopicOrder,
  selectTopicOrder,
  selectedTopicOrder,
  setRightMenuOpenForMenu,
  topicKey,
  topicOrders
}) => {
  const handleSelectDefaultOrder = defaultOrder => {
    for (let index = 0; index < topicOrders.length; index++) {
      const element = topicOrders[index];
      if (defaultOrder.id !== element.id) {
        element.attributes.is_default = false;
      }
    }
  };

  const handleCreateOrder = () => {
    createTopicOrder({ cardOrder: [], subtopicOrder: [], topicId: topicKey });
  };

  return (
    <div className="right-submenu">
      <div className="right-submenu_header">
        <IconButton
          fontAwesome
          icon="caret-left"
          onClick={() => setRightMenuOpenForMenu('Orders')}
        />
        <span className="ml5">Card & yay Orders</span>
      </div>
      {topicOrders.map(topicOrder => (
        <OrdersMenuRow
          isSelected={selectedTopicOrder == topicOrder}
          key={topicOrder.id}
          order={topicOrder}
          orderType="topic"
          handleSelectDefaultOrder={handleSelectDefaultOrder}
        />
      ))}
      <div className="right-submenu_item option" key={'0'}>
        <a
          className={`right-submenu_item no-border ${selectedTopicOrder &&
            selectedTopicOrder.id == '0' &&
            'active bold'}`}
          onClick={() =>
            selectTopicOrder({ topicId: topicKey, topicOrderId: '0' })
          }
        >
          <span className="ml5">Most Recent First</span>
        </a>
      </div>
      <div className="right-submenu_item option" key={'NEW'}>
        <a
          className={'right-submenu_item no-border'}
          onClick={handleCreateOrder}
        >
          <span className="ml5">Create New Order</span>
        </a>
      </div>
    </div>
  );
};

RightCardTopicOrdersMenu.propTypes = {
  setRightMenuOpenForMenu: func.isRequired,
  topicOrders: array.isRequired
};

const mapState = state => {
  const sm = stateMappings(state);
  const topicId = sm.page.topicId;
  const topicKey = topicId ? topicId : '0';

  return {
    topicKey: topicKey,
    topicOrders: getTopicOrdersByTopic(state)[topicKey] || [],
    selectedTopicOrder: getRelevantTopicOrderForTopic(state, topicKey)
  };
};

const mapDispatch = {
  createTopicOrder,
  selectTopicOrder,
  setRightMenuOpenForMenu
};

export default connect(
  mapState,
  mapDispatch
)(RightCardTopicOrdersMenu);
