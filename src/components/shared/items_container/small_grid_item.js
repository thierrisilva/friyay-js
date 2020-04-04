import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SmallGridItemTip from './small_grid_item/small_grid_item_tip';

class SmallGridItem extends PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    handleItemClick: PropTypes.func.isRequired,
    onLikeUnlikeClick: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    group: PropTypes.object,
    onStarUnstarClick: PropTypes.func.isRequired,
    archiveItem: PropTypes.func.isRequired,
  };

  render() {
    const { props } = this;
    if (!props.item.attributes) {
      return <div>Missing item attributes</div>;
    }

    return (
      <div className={`small-grid-item color-${props.item.attributes.color_index}`}>
        <SmallGridItemTip {...props} />
      </div>
    );
  }
}

export default SmallGridItem;
