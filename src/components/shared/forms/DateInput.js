import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SingleDatePicker from 'react-dates/lib/components/SingleDatePicker';

class DateInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    date: PropTypes.any,
    isOutsideRange: PropTypes.func,
    placeholder: PropTypes.string,
    reactDatesProps: PropTypes.object,
    onChange: PropTypes.func
  };

  state = { showDatePicker: false };

  handleFocusChange = ({ focused }) => {
    this.setState({ showDatePicker: focused });
  };

  handleDateChange = date => {
    const value = date ? date.valueOf() : null;

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  render() {
    const inputClassNames = classNames(this.props.className, 'date-input');
    const momentDate = this.props.date
      ? moment(this.props.date)
      : this.props.date;

    return (
      <div className={inputClassNames}>
        <SingleDatePicker
          date={momentDate}
          displayFormat={() => 'MMM DD - YYYY'}
          focused={this.state.showDatePicker}
          inputIconPosition="after"
          isOutsideRange={this.props.isOutsideRange}
          numberOfMonths={1}
          placeholder={this.props.placeholder}
          showDefaultInputIcon={!this.props.date}
          showClearDate={false}
          onDateChange={this.handleDateChange}
          onFocusChange={this.handleFocusChange}
          {...this.props.reactDatesProps}
        />
      </div>
    );
  }
}

export default DateInput;
