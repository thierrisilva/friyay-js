/* global vex */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Ability from 'Lib/ability';
import viewConfig from 'Lib/config/views/views';
import { stateMappings } from 'Src/newRedux/stateMappings';

import {
  getRelevantTopicOrderForTopic,
  getTopicOrdersForTopic
} from 'Src/newRedux/database/topicOrders/selectors';
import {
  removeTopicOrder,
  selectTopicOrder
} from 'Src/newRedux/database/topicOrders/thunks';
import { changeSelectedOrder } from 'Src/newRedux/filters/thunks';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';

import MoreIcon from 'Components/shared/more_icon';
import IconButton from 'Components/shared/buttons/IconButton';
import Icon from 'Components/shared/Icon';

const OrdersMenuDropDown = ({
  currentTopic,
  onConfirmDelete,
  onEditNameClick,
  onSetAsDefaultForTopic
}) => {
  const handleDeleteOrder = () => {
    vex.dialog.confirm({
      message: 'Are you sure you want to delete this order?',
      callback: value => {
        value && onConfirmDelete();
      }
    });
  };

  return (
    <div className="dropdown card-actions-dropdown">
      <a
        className="dropdown"
        data-toggle="dropdown"
        role="button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span>
          <MoreIcon />
        </span>
      </a>

      <ul
        className="dropdown-menu dropdown-menu-right"
        aria-labelledby="dLabel"
      >
        <li>
          <a onClick={onEditNameClick}>Rename</a>
          <a onClick={handleDeleteOrder}>Delete Order</a>
          {onSetAsDefaultForTopic &&
            currentTopic &&
            Ability.can('update', 'self', currentTopic) && (
              <a onClick={() => onSetAsDefaultForTopic(currentTopic)}>
                Set as yay Default
              </a>
            )}
        </li>
      </ul>
    </div>
  );
};

const mapState = state => {
  const sm = stateMappings(state);
  const topics = sm.topics;
  return {
    currentTopic: sm.page.topicId ? topics[sm.page.topicId] : null
  };
};

export default connect(mapState)(OrdersMenuDropDown);
