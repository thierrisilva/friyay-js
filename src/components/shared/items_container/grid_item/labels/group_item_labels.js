import React, { Component } from 'react';
import PropTypes from 'prop-types';
import inflection from 'inflection';
import GroupItemLabel from './group_item_label';
import flatten from 'lodash/flatten';

const labelGroupHelpText = key =>
  key.toUpperCase() === 'PUBLIC'
    ? 'Labels everyone will see'
    : 'Labels only you will see';

const GroupItemLabels = ({ item, labels, switchScreen }) => {
  const groups = flatten(
    labels
      .reduce(
        (sum, next) =>
          sum.includes(next.attributes.kind)
            ? sum
            : [...sum, next.attributes.kind],
        []
      )
      .filter(kind => kind !== 'system')
      .map(kind => {
        const labelsOfKind = labels.filter(
          label => label.attributes.kind === kind
        );

        return [
          <div
            className="list-group-item list-group-header"
            key={`label-header-${kind}`}
          >
            <label>{inflection.titleize(kind)} Labels</label>
            <span className="small ml50">{labelGroupHelpText(kind)}</span>
          </div>,
          <div
            className="labels-box pb25"
            key={`${kind}-labels-box-${item.id}`}
          >
            {labelsOfKind.map(label => (
              <GroupItemLabel
                kind={kind}
                item={item}
                label={label}
                key={`item-${item.id}-group-label-${label.id}`}
                switchScreen={switchScreen}
              />
            ))}
          </div>
        ];
      })
  );

  return (
    <div className="list-group-menu-content" key={`group-item-${item.id}`}>
      {groups}
    </div>
  );
};

GroupItemLabels.propTypes = {
  item: PropTypes.object.isRequired,
  labels: PropTypes.array,
  switchScreen: PropTypes.func
};

export default GroupItemLabels;
