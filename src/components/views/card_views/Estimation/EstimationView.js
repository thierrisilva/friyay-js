import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';

import SheetView from '../Sheet/SheetView';
import { columns } from '../Sheet/sheetConfig/index';

const sheetColumns = [
  columns.estimated_work,
  columns.confidence_range,
  columns.actual_work,
  columns.variance
];

class EstimationView extends Component {
  static propTypes = {
    cardRequirements: PropTypes.object.isRequired,
    cards: PropTypes.array.isRequired,
    subtopics: PropTypes.array.isRequired,
    topic: PropTypes.object
  };

  render() {
    return (
      <Fragment>
        <SheetView
          columns={sheetColumns}
          configureColumns={false}
          {...this.props}
          additionalClasses="estimation-view"
        />
      </Fragment>
    );
  }
}

export default EstimationView;
