import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StringHelper from '../../../../helpers/string_helper';
import TipHeader from './tip_header';
import TipActions from '../list_item/tip_actions';

class SmallGridItemTip extends Component {
  handleClick = e => {
    if (e.target.nodeName === 'A') {
      return;
    }

    e.preventDefault();
    this.props.handleItemClick(this.props.item);
  }

  render() {
    const {
      props: {
        item,
        onLikeUnlikeClick,
        onStarUnstarClick,
        group,
        removeItem,
        archiveItem,
        handleItemClick
      }
    } = this;

    const { relationships: { labels: { data } }, attributes: { title } } = item;
    const len = data.length;

    const barSegments = data.map(({ id, color }) => (
      <div
        key={`label-top-bar${item.id}-${id}`}
        className={`label-bar bg-color-${color} labels-${len}`}
      />
    ));

    return (
      <div className="small-grid-item-content">
        <div className="indicator-bar">
          {barSegments}
        </div>
        <TipHeader 
          item={item} 
          group={group} 
          removeItem={removeItem} 
          archiveItem={archiveItem} 
        />
        <div className="item-body" onClick={this.handleClick}>
          <h3 className="item-title">
            <span className="title-truncated">{StringHelper.truncate(title, 40)}</span>
          </h3>
        </div>
				<TipActions 
          item={item} 
          removeItem={removeItem}
          archiveItem={archiveItem}
          handleItemClick={handleItemClick}
          onLikeUnlikeClick={onLikeUnlikeClick}
          onStarUnstarClick={onStarUnstarClick} 
          moreIcon={false} 
        />
      </div>
    );
  }
}

SmallGridItemTip.propTypes = {
  item: PropTypes.object.isRequired,
  onLikeUnlikeClick: PropTypes.func.isRequired,
  handleItemClick: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
  archiveItem: PropTypes.func.isRequired,
  group: PropTypes.object,
  onStarUnstarClick: PropTypes.func.isRequired,
};

export default SmallGridItemTip;
