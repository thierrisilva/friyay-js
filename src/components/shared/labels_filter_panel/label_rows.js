import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../Loader';
import LabelRow from './label_row';
import tiphive from 'Lib/tiphive';

const LabelRows = ({
  labelType,
  labels,
  handleAddLabelClick,
  handleLabelSelect,
  handleLabelDelete,
  isLoading,
  labelsFilter,
  selectedLabel
}) => {
  let isSelected;


  let content = labels.map(label => {

    if (labelsFilter) {
      isSelected = labelsFilter.includes(label.id);
    } else {
      isSelected = selectedLabel ? selectedLabel.id === label.id : false;
    }

    return <LabelRow
      isGuest={tiphive.userIsGuest()}
      labelType={labelType}
      key={label.id}
      isSelected={isSelected}
      label={label}
      handleLabelSelect={handleLabelSelect}
      handleLabelDelete={handleLabelDelete}
    />
  });

  if (labels.length === 0 && isLoading === false) {
    content = <p className="text-center">No labels found</p>;
  }

  return (
    <div className="labels-list-section">
      <label>{labelType} LABELS</label>
      <div className="labels-list mt10">
        {isLoading && (
          <p className="text-center">
            <Loader />
          </p>
        )}
        {content}
      </div>

      {!tiphive.userIsGuest() && labelType !== 'system' && (
        <a onClick={handleAddLabelClick}>
          + Add {labelType} label
        </a>
      )}
    </div>
  );
};

LabelRows.propTypes = {
  labelType: PropTypes.string.isRequired,
  labels: PropTypes.array,
  handleAddLabelClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  labelsFilter: PropTypes.array,
  handleLabelSelect: PropTypes.func.isRequired,
  handleLabelDelete: PropTypes.func.isRequired,
  selectedLabel: PropTypes.object
};

LabelRows.defaultProps = {
  labels: [],
  isLoading: false
};

export default LabelRows;
