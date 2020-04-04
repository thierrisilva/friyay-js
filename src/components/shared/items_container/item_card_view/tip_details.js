import React from 'react';
import PropTypes from 'prop-types';
import StringHelper from '../../../../helpers/string_helper';
import UserAvatar from '../../user_avatar';

const TipDetails = ({ item, handleItemClick }) => {
  const { title, creator } = item.attributes;

  return (
    <div className="tip-details flex-r-center-center">
      <div className="avatar-wrapper pl10" style={{marginRight: -10}}>
        <UserAvatar user={ creator } />
      </div>
      <div className="details-wrapper" onClick={() => handleItemClick(item)}>
        <h5 className="item-title">{StringHelper.truncate(title, 30)}</h5>
      </div>
    </div>
  );
};

TipDetails.propTypes = {
  item: PropTypes.object.isRequired,
  handleItemClick: PropTypes.func.isRequired,
  group: PropTypes.object
};

export default TipDetails;
