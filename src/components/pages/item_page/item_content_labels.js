import React from 'react';
import PropTypes from 'prop-types';
import LabelsList from './labels_list';

const ItemContentLabels = ({
  tip,
  labels
}) => (
  <LabelsList
    tip={tip}
    labelIds={labels}
  />
);

ItemContentLabels.defaultProps = {
  tip: null,
  labels: []
};

ItemContentLabels.propTypes = {
  tip: PropTypes.object.isRequired,
  labels: PropTypes.array.isRequired,
};

export default ItemContentLabels;
