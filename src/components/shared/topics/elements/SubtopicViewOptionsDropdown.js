import React from 'react';
import PropTypes from 'prop-types';
import OptionsDropdownButton from 'Src/components/shared/buttons/OptionsDropdownButton';
import Icon from 'Src/components/shared/Icon';

const OPTIONS = [
  {
    value: 'SMALL_HEX',
    icon: 'topic',
    label: 'Hex'
  },
  {
    value: 'ROW',
    icon: 'label',
    label: 'Row'
  },
  {
    value: 'LIST',
    icon: 'view_list',
    label: 'List'
  },
  {
    value: 'TILE',
    icon: 'view_module',
    label: 'Tile'
  }
];

class SubtopicViewOptionsDropdown extends React.PureComponent {
  static propTypes = {
    onSelect: PropTypes.func
  };

  render() {
    return (
      <OptionsDropdownButton
        icon="arrow_drop_down"
        dropdownLeft={true}
        additionalClasses="grey-icon-button"
      >
        {OPTIONS.map(({ value, icon, label }) => (
          <li key={label}>
            <a
              className="dropdown-option-item"
              onClick={e => this.props.onSelect(value)}
            >
              <Icon icon={icon} />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </OptionsDropdownButton>
    );
  }
}

export default SubtopicViewOptionsDropdown;
