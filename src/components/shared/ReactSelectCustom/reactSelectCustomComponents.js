import React from 'react';
import { components } from 'react-select';

export const MultiValueRemove = props => (
  <components.MultiValueRemove
    {...props}
    innerProps={{
      ...props.innerProps,
      className: `${props.innerProps.className} card-label-color-${
        props.data.item.attributes.color
      }`
    }}
  />
);

export const MultiValueLabel = props => (
  <components.MultiValueRemove
    {...props}
    innerProps={{
      ...props.innerProps,
      className: `${props.innerProps.className} card-label-color-${
        props.data.item.attributes.color
      }`
    }}
  />
);
