import React, { Component } from 'react';
import Dotdotdot from 'react-dotdotdot';
import { bool, string, func, array, object } from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'Components/shared/Icon';
import SelectableLabelList from 'Components/shared/labels/elements/SelectableLabelList';

class LabelSelect extends Component {
  state = {
    showDropdown: false
  };

  static defaultProps = {
    containerClassName: ''
  };

  static propTypes = {
    canAddOrEdit: bool,
    containerClassName: string,
    selectedLabel: object,
    onSelectLabel: func.isRequired
  };

  handleClickEvent = e => {
    this.dropdownRef &&
      !this.dropdownRef.contains(e.target) &&
      this.handleToggleDropdown();
  };

  handleSelectLabel = ([labelId]) => {
    this.props.onSelectLabel(labelId);
    this.handleToggleDropdown();
  };

  handleToggleDropdown = () => {
    const { showDropdown } = this.state;
    this.setState({ showDropdown: !showDropdown });
    showDropdown
      ? document.removeEventListener('click', this.handleClickEvent, true)
      : document.addEventListener('click', this.handleClickEvent, true);
  };

  saveDropdownRef = ref => {
    this.dropdownRef = ref;
  };

  render() {
    const { canAddOrEdit, selectedLabel } = this.props;
    const { showDropdown } = this.state;

    return (
      <div
        className={`dropdown label-select ${showDropdown && 'open'}`}
        ref={this.saveDropdownRef}
      >
        <a
          onClick={this.handleToggleDropdown}
          className="dropdown label-select"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className="label-select_name">
            <Dotdotdot clamp={1}>
              {selectedLabel ? selectedLabel.attributes.name : 'Select label'}
            </Dotdotdot>
          </span>
          <Icon fontAwesome icon="caret-down" />
        </a>
        <div
          className={`dropdown-menu label-select-dropdown ${showDropdown &&
            'open'}`}
          aria-labelledby="dLabel"
        >
          <SelectableLabelList
            canAddOrEdit={canAddOrEdit}
            onCreateLabel={this.handleSelectLabel}
            onChangeSelection={this.handleSelectLabel}
            selectedLabelIds={selectedLabel ? [selectedLabel.id] : []}
          />
        </div>
      </div>
    );
  }
}

export default LabelSelect;
