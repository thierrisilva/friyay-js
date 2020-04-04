import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LabelItem from './label_item';
import toSafeInteger from 'lodash/toSafeInteger';

import { stateMappings } from 'Src/newRedux/stateMappings.js';

const LabelsList = ({ tip, labelIds, labels, labelList }) => {
  const labelItems = labels.map(label => {
    const found = labelList.find(
      ({ id }) => toSafeInteger(id) === toSafeInteger(label.id)
    );

    const toDisplay =
      found !== undefined
        ? {
            id: found.id,
            name: found.attributes.name,
            color: found.attributes.color,
            kind: found.attributes.kind
          }
        : label;
    return (
      <LabelItem
        key={`label-${tip.id}-${label.id}`}
        label={toDisplay}
        item={tip}
      />
    );
  });

  return (
    <div className="labels-list">
      <div className="labels-list-wrapper">
        <div className="labels-list-content">{labelItems}</div>
      </div>

      <span className="labels-count">{labels.length}</span>
    </div>
  );
};

LabelsList.defaultProps = {
  tip: null,
  labelList: []
};

LabelsList.propTypes = {
  tip: PropTypes.object.isRequired,
  labelList: PropTypes.array
};

// const mapState = ({ labels: { collection } }) => ({ labelList: collection });

const mapState = (state, props) => {
  const sm = stateMappings(state);

  const allLabels = sm.labels;

  const labelList = Object.values(allLabels);

  const labelsForTip = props.labelIds.map(id => {
    return allLabels[id];
  });

  return {
    labelList,
    labels: labelsForTip
  };
};

export default connect(mapState)(LabelsList);
