import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func, object } from 'prop-types';
import Ability from 'Lib/ability';

import { addRemoveLabelsOnCard } from 'Src/newRedux/database/cards/thunks';

const CardLabel = ({ card, label, addRemoveLabelsOnCard }) => {

  const canRemove = Ability.can('update', 'self', card);

  return label ? (
      <div className={` card-label color-${label.attributes.color}`}>
        <span className="card-label_title">
          {label.attributes.name}
        </span>
        {canRemove && (
          <a className="card-label_remove" onClick={() => addRemoveLabelsOnCard(card, [], [label.id])} >
            <i className="fa fa-close" />
          </a>
        )}
      </div>
  ) : false;
};

CardLabel.propTypes = {
  card: object.isRequired,
  addRemoveLabelsOnCard: func.isRequired
};

const mapState = (state, props) => ({
  label: state._newReduxTree.database.labels[ props.labelId ]
})

const mapDispatch = {
  addRemoveLabelsOnCard,
};

export default connect(mapState, mapDispatch)(CardLabel);
