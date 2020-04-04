import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import FilterLabelChip from '../FilterLabelChip';
import { removeLabelFilter as removeLabelFilterAction } from 'Actions/labelsFilter';
import { CARD_FILTER_ENUM } from 'Enums';

const filterTitles = {
  [CARD_FILTER_ENUM.ALL]: 'All Cards',
  [CARD_FILTER_ENUM.FOLLOWING]: 'Cards from yays I Follow',
  [CARD_FILTER_ENUM.LIKED]: 'Cards I Liked',
  [CARD_FILTER_ENUM.STARRED]: 'Cards I Starred',
  [CARD_FILTER_ENUM.MINE]: 'My Cards',
  [CARD_FILTER_ENUM.POPULAR]: 'Popular Cards'
};

function ActiveFiltersLabels({
  filter,
  labels,
  removeFilter,
  removeLabelFilter
}) {
  return (
    <div className="active-filters-labels">
      <span className="active-filters-labels__label">Showing:</span>
      <FilterLabelChip
        className="active-filters-labels__chip"
        isStretching
        title={filterTitles[filter]}
        onRemoveClick={removeFilter}
      />
      {labels.map(({ id, attributes: { color, name } }) => (
        <FilterLabelChip
          key={id}
          className="active-filters-labels__chip"
          color={color}
          title={name}
          onRemoveClick={() => removeLabelFilter(id)}
        />
      ))}
    </div>
  );
}

ActiveFiltersLabels.propTypes = {
  filter: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.object),
  removeFilter: PropTypes.func,
  removeLabelFilter: PropTypes.func.isRequired
};

function mapState({
  labels: { collection: labels },
  labelsFilter,
  rightBarFilter: { currentFilter }
}) {
  const activeLabels = labels.filter(label => labelsFilter.includes(label.id));

  return {
    filter: currentFilter,
    labels: activeLabels
  };
}

const mapDispatch = { removeLabelFilter: removeLabelFilterAction };

export default connect(
  mapState,
  mapDispatch
)(ActiveFiltersLabels);
