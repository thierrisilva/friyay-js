import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ItemAssignmentPath from '../../../shared/item_assignment_path';
import StringHelper from '../../../../helpers/string_helper';
import UserAvatar from '../../user_avatar';

class TipDetails extends Component {
  handleClick = e => {
    if (e.target.nodeName === 'A') {
      return;
    }

    e.preventDefault();
    this.props.handleItemClick(this.props.item);
  };

  render() {
    const { props: { item, group } } = this;
    const { title, creator } = item.attributes;

    return (
      <div className="tip-details">
        <div className="avatar-wrapper pl10 flex-r-center-center" style={{marginRight: -10, marginTop: -3}}>
          <UserAvatar user={ creator } extraClass="flex-r-center-center" size={24} />
        </div>
        <div className="details-wrapper" onClick={this.handleClick}>
          <h5 className="item-title">{StringHelper.truncate(title, 40)}</h5>
        </div>
      </div>
    );
  }
}

TipDetails.propTypes = {
  item: PropTypes.object,
  handleClick: PropTypes.func,
  handleItemClick: PropTypes.func,
  group: PropTypes.object
};

export default TipDetails;
