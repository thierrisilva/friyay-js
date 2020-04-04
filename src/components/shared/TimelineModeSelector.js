import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class TimelineModeSelector extends Component {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    goalView: PropTypes.bool,
    view: PropTypes.string
  };

  state = { showDropdown: false };

  handleOptionSelect(id) {
    this.props.onChange(id);
    this.toggleDropdown();
  }

  handleOutsideClick = ev => {
    if (!this.dropdownRef.contains(ev.target)) {
      this.toggleDropdown();
    }
  };

  saveDropdownRef = ref => {
    this.dropdownRef = ref;
  };

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown }, () => {
      if (this.state.showDropdown) {
        document.addEventListener('click', this.handleOutsideClick, false);
      } else {
        document.removeEventListener('click', this.handleOutsideClick, false);
      }
    });
  };

  render() {
    const controlClassNames = classNames(
      this.props.className,
      'timeline-mode-selector'
    );

    let columnModeInUse = null;
    if (this.props.view === 'calendar') {
      columnModeInUse = columnModeOptionsCalendarView;
    } else if (this.props.goalView) {
      columnModeInUse = columnModeOptionsGoalView;
    } else if (this.props.view === 'status_table') {
      columnModeInUse = columnModeOptionsStatusTableView;
    } else {
      columnModeInUse = columnModeOptions;
    }

    const activeOption =
      columnModeInUse.find(opt => opt.id === this.props.value) ||
      columnModeInUse[0];

    return (
      <div className={controlClassNames}>
        <div
          className="timeline-mode-selector__value"
          onClick={this.toggleDropdown}
        >
          {activeOption.name}
          <span className="timeline-mode-selector__arrow material-icons">
            {this.state.showDropdown ? 'arrow_drop_up' : 'arrow_drop_down'}
          </span>
        </div>
        {this.state.showDropdown && (
          <ul
            ref={this.saveDropdownRef}
            className="timeline-mode-selector__options"
          >
            {columnModeInUse.map(opt => (
              <li
                key={opt.id}
                className="timeline-mode-selector__option"
                onClick={() => this.handleOptionSelect(opt.id)}
              >
                {opt.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

const columnModeOptions = [
  { id: 'quarters', name: 'Quarters' },
  { id: 'months', name: 'Months' },
  { id: 'weeks', name: 'Weeks' },
  { id: 'weeksWD', name: 'Weeks (weekdays)' },
  { id: 'days', name: 'Days' },
  { id: 'daysWD', name: 'Days (weekdays)' }
];

const columnModeOptionsGoalView = [
  { id: 'quarters', name: 'Quarters' },
  { id: 'months', name: 'Months' },
  { id: 'weeks', name: 'Weeks' },
  { id: 'days', name: 'Days' },
  { id: 'any', name: 'Any Due Date' }
];

const columnModeOptionsCalendarView = [
  { id: 'months', name: 'Months' },
  { id: 'monthsWD', name: 'Months (weekdays)' },
  { id: 'weeks', name: 'Weeks' },
  { id: 'weeksWD', name: 'Weeks (weekdays)' }
];

const columnModeOptionsStatusTableView = [
  { id: 'weeks', name: 'Month' },
  { id: 'days', name: 'Week' }
];

export default TimelineModeSelector;
