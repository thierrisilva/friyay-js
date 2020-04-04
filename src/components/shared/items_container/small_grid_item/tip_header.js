import React from 'react';
import PropTypes from 'prop-types';
import Ability from '../../../../lib/ability';
import { Link } from 'react-router-dom';
import ItemAssignmentPath from '../../../shared/item_assignment_path';
import TipActionListDropdown from '../list_item/tip_action_list_dropdown';
import moment from 'moment';

const spanStyle = {color: '#888'};

const TipHeader = ({
  item,
  group,
  removeItem,
  archiveItem,
}) => {
  const { creator: { id, name } } = item.attributes;

  let tipActionListDropdown = null;
  if (Ability.can('update', 'self', item)) {
    tipActionListDropdown = (
      <TipActionListDropdown 
        item={item} 
        removeItem={removeItem} 
        archiveItem={archiveItem}
      />
    );
  }

  return (
    <div className="item-header flex-r-start-spacebetween">
      <div className="header-text">
        <div className="flex-r-center">
          <Link to={`/users/${id}`} className="item-user-name">{name}</Link>
          <span style={spanStyle} className="ml5">
            {moment(item.attributes.updated_at).format('DD MMM YY')}
          </span>
        </div>
        <div className="item-topic-content">
          <ItemAssignmentPath group={group} item={item} maxCharacters={20} />
        </div>
      </div>
      <div className="pt5 pr5">
        {tipActionListDropdown}
      </div>
    </div>
  );
};

TipHeader.propTypes = {
  item: PropTypes.object.isRequired,
  group: PropTypes.object,
  removeItem: PropTypes.func.isRequired,
  archiveItem: PropTypes.func.isRequired
};

export default TipHeader;