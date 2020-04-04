import React from 'react';
import PropTypes from 'prop-types';
import CustomDragLayer from '../shared/custom_drag_layer';
import { withRouter } from 'react-router';

const PageContainer = ({
  group,
  topic,
  children
}) => (
  <div className="page-container" id="page-container">
    {children}
  </div>
);

PageContainer.propTypes = {
  group: PropTypes.object,
  topic: PropTypes.object,
  params: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
};

export default withRouter(PageContainer);
