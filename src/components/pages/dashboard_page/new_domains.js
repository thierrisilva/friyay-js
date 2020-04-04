import React from 'react';
import createClass from 'create-react-class';

var NewDomains = createClass({
  is2017: function(objectList) {
    return objectList.year == 2017;
  },

  monthFilter: function(objectList, month) {
    var filteredList = objectList.filter(
      function(obj) { return obj.month == month; }
    );

    return filteredList;
  },

  countForMonth: function(objectList, month) {
    if (this.monthFilter(objectList, month).length) {
      return this.monthFilter(objectList, month)[0].count;
    } else {
      return 0;
    }
  },

  currentMonthClassName: function(tableMonth) {
    const dateNow = new Date();
    if (String(dateNow.getMonth()) == tableMonth) {
      return 'text-center bg-info';
    } else {
      return 'text-center';
    }
  },

  renderYearlyDomainCounts: function(yearlyDomainCounts) {
    var html = '';

    var headers = [];
    var bodies = [];
    yearlyDomainCounts.forEach(function(value, key) {
      headers.push(<th className='text-center'>{key}</th>);
      bodies.push(<td className='text-center'>{value}</td>);
    });

    html = [<thead><tr>{headers}</tr></thead>, <tbody><tr>{bodies}</tr></tbody>];

    return html;
  },

  render: function() {
    var statData = this.props.stats.data.new_domain_totals;
    var yearlyDomainCounts = this.props.stats.data.yearly_domain_counts;
    var statsFor2017 = statData.filter(this.is2017);

    return (
      <div className="statistics col-md-9 col-md-offset-1">
        <h1>Yearly Workspace Counts</h1>
        <table className="table table-bordered table-condensed" style={{ width: '25%' }}>
          {this.renderYearlyDomainCounts(yearlyDomainCounts)}
        </table>
        <h1>New Workspace Totals <span className="small">for 2017</span> </h1>
        <table className="table table-bordered table-condensed">
          <thead>
            <tr>
              <th className={ this.currentMonthClassName(1) }>Jan</th>
              <th className={ this.currentMonthClassName(2) }>Feb</th>
              <th className={ this.currentMonthClassName(3) }>Mar</th>
              <th className={ this.currentMonthClassName(4) }>Apr</th>
              <th className={ this.currentMonthClassName(5) }>May</th>
              <th className={ this.currentMonthClassName(6) }>Jun</th>
              <th className={ this.currentMonthClassName(7) }>Jul</th>
              <th className={ this.currentMonthClassName(8) }>Aug</th>
              <th className={ this.currentMonthClassName(9) }>Sep</th>
              <th className={ this.currentMonthClassName(10) }>Oct</th>
              <th className={ this.currentMonthClassName(11) }>Nov</th>
              <th className={ this.currentMonthClassName(12) }>Dec</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={ this.currentMonthClassName(1) }>{ this.countForMonth(statsFor2017, 1) }</td>
              <td className={ this.currentMonthClassName(2) }>{ this.countForMonth(statsFor2017, 2) }</td>
              <td className={ this.currentMonthClassName(3) }>{ this.countForMonth(statsFor2017, 3) }</td>
              <td className={ this.currentMonthClassName(4) }>{ this.countForMonth(statsFor2017, 4) }</td>
              <td className={ this.currentMonthClassName(5) }>{ this.countForMonth(statsFor2017, 5) }</td>
              <td className={ this.currentMonthClassName(6) }>{ this.countForMonth(statsFor2017, 6) }</td>
              <td className={ this.currentMonthClassName(7) }>{ this.countForMonth(statsFor2017, 7) }</td>
              <td className={ this.currentMonthClassName(8) }>{ this.countForMonth(statsFor2017, 8) }</td>
              <td className={ this.currentMonthClassName(9) }>{ this.countForMonth(statsFor2017, 9) }</td>
              <td className={ this.currentMonthClassName(10) }>{ this.countForMonth(statsFor2017, 10) }</td>
              <td className={ this.currentMonthClassName(11) }>{ this.countForMonth(statsFor2017, 11) }</td>
              <td className={ this.currentMonthClassName(12) }>{ this.countForMonth(statsFor2017, 12) }</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

export default NewDomains;
