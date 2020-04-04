import React from 'react';
import Select from 'react-select';
import reactSelectCustomTheme from './reactSelectCustomTheme';
import reactSelectCustomStyles from './reactSelectCustomStyles';

const ReactSelectCustom = ({ components, ...props }) => (
  <Select
    components={{
      IndicatorSeparator: () => null,
      ClearIndicator: () => null,
      ...components
    }}
    {...props}
  />
);

ReactSelectCustom.defaultProps = {
  theme: reactSelectCustomTheme,
  styles: reactSelectCustomStyles
};

export default ReactSelectCustom;
