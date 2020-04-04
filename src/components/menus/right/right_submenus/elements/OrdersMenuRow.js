import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bool, func, object, string } from 'prop-types';
import { stateMappings } from 'Src/newRedux/stateMappings';

import {
  updateLabelOrder,
  safelyRemoveLabelOrder,
  selectLabelOrder
} from 'Src/newRedux/database/labelOrders/thunks';
import {
  updatePeopleOrder,
  safelyRemovePeopleOrder,
  selectPeopleOrder
} from 'Src/newRedux/database/peopleOrders/thunks';
import {
  updateTopicOrder,
  removeTopicOrder,
  selectTopicOrder
} from 'Src/newRedux/database/topicOrders/thunks';
import { updateTopic } from 'Src/newRedux/database/topics/thunks';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';

import DefaultBadge from 'Components/shared/badges/DefaultBadge';
import Input from 'Components/shared/forms/Input';
import OrdersMenuDropDown from './OrdersMenuDropDown';

class OrdersMenuRow extends PureComponent {
  static propTypes = {
    isSelected: bool,
    order: object.isRequired,
    safelyRemoveLabelOrder: func.isRequired,
    safelyRemovePeopleOrder: func.isRequired,
    removeTopicOrder: func.isRequired,
    setRightMenuOpenForMenu: func.isRequired,
    updateLabelOrder: func.isRequired,
    updatePeopleOrder: func.isRequired,
    updateTopicOrder: func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      inEditMode: false,
      orderName: props.order.attributes.name
    };
  }

  handleChangeName = e => {
    this.setState({ orderName: e.target.value });
  };

  handleKeyDown = e => {
    (e.key == 'Escape' || e.keyCode == 27) && this.handleToggleEditMode();
  };

  handleRemoveOrder = () => {
    const {
      order,
      orderType,
      safelyRemoveLabelOrder,
      safelyRemovePeopleOrder,
      removeTopicOrder
    } = this.props;
    orderType == 'label' && safelyRemoveLabelOrder(order.id);
    orderType == 'people' && safelyRemovePeopleOrder(order.id);
    orderType == 'topic' && removeTopicOrder(order.id);
  };

  handleSelectOrder = () => {
    const {
      order,
      orderType,
      selectLabelOrder,
      selectPeopleOrder,
      selectTopicOrder,
      setRightMenuOpenForMenu
    } = this.props;
    orderType == 'label' && selectLabelOrder(order.id);
    orderType == 'people' && selectPeopleOrder(order.id);
    orderType == 'topic' && selectTopicOrder({ topicOrder: order });
    setRightMenuOpenForMenu(false);
  };

  handleSetAsDefaultForTopic = () => {
    const { order, orderType } = this.props;
    const key = orderType + '_order';
    let defaultOrder = { ...order };
    defaultOrder.attributes.is_default = true;
    orderType == 'topic' && this.props.updateTopicOrder(defaultOrder);
    orderType == 'label' && this.props.updateLabelOrder(defaultOrder);
    orderType == 'people' && this.props.updatePeopleOrder(defaultOrder);
    this.props.handleSelectDefaultOrder(defaultOrder);
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    const {
      order,
      orderType,
      updateLabelOrder,
      updatePeopleOrder,
      updateTopicOrder
    } = this.props;
    orderType == 'label' &&
      updateLabelOrder({
        id: order.id,
        attributes: { name: this.state.orderName }
      });
    orderType == 'people' &&
      updatePeopleOrder({
        id: order.id,
        attributes: { name: this.state.orderName }
      });
    orderType == 'topic' &&
      updateTopicOrder({
        id: order.id,
        attributes: { name: this.state.orderName }
      });
    this.handleToggleEditMode();
  };

  handleToggleEditMode = () => {
    this.state.inEditMode
      ? window.removeEventListener('keydown', this.handleKeyDown, true)
      : window.addEventListener('keydown', this.handleKeyDown, true);
    this.setState(state => ({ inEditMode: !state.inEditMode }));
  };

  render() {
    const { isSelected, orderType, order } = this.props;
    let { isDefault } = this.props;
    const { inEditMode, orderName } = this.state;

    if (orderType === 'topic') {
      isDefault = order.attributes.is_default;
    }

    return (
      <div className="right-submenu_item option" key={order.id}>
        {inEditMode ? (
          <form onSubmit={this.handleSubmit}>
            <Input defaultValue={orderName} onChange={this.handleChangeName} />
          </form>
        ) : (
          <a
            className={`right-submenu_item no-border ${isSelected &&
              'active bold'}`}
            onClick={this.handleSelectOrder}
          >
            <span className="ml5">{order.attributes.name}</span>
            {isDefault && <DefaultBadge />}
          </a>
        )}
        <OrdersMenuDropDown
          order={order}
          onConfirmDelete={this.handleRemoveOrder}
          onSetAsDefaultForTopic={this.handleSetAsDefaultForTopic}
          onEditNameClick={this.handleToggleEditMode}
        />
      </div>
    );
  }
}

const mapDispatch = {
  safelyRemoveLabelOrder,
  safelyRemovePeopleOrder,
  removeTopicOrder,
  selectLabelOrder,
  selectPeopleOrder,
  selectTopicOrder,
  setRightMenuOpenForMenu,
  updateLabelOrder,
  updatePeopleOrder,
  updateTopic,
  updateTopicOrder
};

export default connect(
  undefined,
  mapDispatch
)(OrdersMenuRow);
