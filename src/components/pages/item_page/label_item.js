import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StringHelper from '../../../helpers/string_helper';
import Ability from '../../../lib/ability';
import { unassignLabel } from 'Src/newRedux/database/labels/actions.js';

const LabelItem = ({ label, item, unassign }) => {
  const canRemove = Ability.can('update', 'self', item);

  return (
    <div className="label-item-container">
      <div className={`label-item color-${label.color}`}>
        <span className="flex-1 text-center">
          {StringHelper.truncate(label.name, 14)}
        </span>
        {canRemove && (
          <a
            className="label-item-clear"
            onClick={() => unassign(label, item.id)}
          >
            <i className="fa fa-close" />
          </a>
        )}
      </div>
    </div>
  );
};

LabelItem.propTypes = {
  item: PropTypes.object.isRequired,
  label: PropTypes.object.isRequired,
  unassign: PropTypes.func
};

const mapState = () => ({});
const mapDispatch = {
  unassign: unassignLabel
};

export default connect(mapState, mapDispatch)(LabelItem);
