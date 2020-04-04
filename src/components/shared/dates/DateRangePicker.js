import React, { Component } from 'react';
import DateRange from 'react-date-range/lib/DateRange';

const defaultTheme = {
  DateRange      : {
    background   : '#ffffff'
  },
  Calendar       : {
    background   : 'transparent',
    color        : '#95a5a6',
  },
  MonthAndYear   : {
    background   : '#F4F4F4',
    color        : '#555555'
  },
  MonthButton    : {
    background   : '#CCCCCC'
  },
  MonthArrowPrev : {
    borderRightColor : '#FFF',
  },
  MonthArrowNext : {
    borderLeftColor : '#FFF',
  },
  Weekday        : {
    background   : '#FAFAFA',
    color        : '#555555'
  },
  Day            : {
    transition   : 'transform .1s ease, box-shadow .1s ease, background .1s ease'
  },
  DaySelected    : {
    background   : '#f2ab13'
  },
  DayActive    : {
    background   : '#f2ab13',
    boxShadow    : 'none'
  },
  DayInRange     : {
    background   : '#f2ab13',
    color        : '#fff'
  },
  DayHover       : {
    background   : '#ffffff',
    color        : '#7f8c8d',
    transform    : 'scale(1.1) translateY(-10%)',
    boxShadow    : '0 2px 4px rgba(0, 0, 0, 0.4)'
  }
}



const DateRangePicker = ({ startDate, endDate, onSelect }) => (

  <div>
    <DateRange
      calendars={1}
      startDate={ startDate }
      endDate={ endDate }
      onChange={ onSelect }
      theme={ defaultTheme }  />
  </div>
)


export default DateRangePicker;
