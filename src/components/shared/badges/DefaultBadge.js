import React from 'react';
import { string } from 'prop-types';

const DefaultBadge = ({ additionalIconClasses = '', text = '' }) => (
  <span className={`default-badge ${additionalIconClasses}`}>
    {text ? text : 'default'}
  </span>
);

DefaultBadge.propTypes = {
  additionalIconClasses: string,
  text: string
};

export default DefaultBadge;
