import React from 'react';
import PropTypes from 'prop-types';
import ListItemTip from './list_item/list_item_tip';

const ListItem = props => {
  if (!props.item.attributes) {
    return <div>Missing item attributes</div>;
  }

  return (
    <div className={`list-item color-${props.item.attributes.color_index}`}>
      <ListItemTip {...props} />
    </div>
  );
};

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  handleItemClick: PropTypes.func.isRequired,
  onLikeUnlikeClick: PropTypes.func.isRequired,
  onStarUnstarClick: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  archiveItem: PropTypes.func.isRequired,
  group: PropTypes.object,
  topic: PropTypes.object,
  tipViewMode: PropTypes.number.isRequired,
};

export default ListItem;
