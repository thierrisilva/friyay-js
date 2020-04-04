import React from 'react';
import createClass from 'create-react-class';

const GlobalStats = createClass({
  render: function() {
    var statData = this.props.stats.data.stats;

    var domainStatRows = [];
    for (var i = 0; i < statData.length; i++) {
      domainStatRows.push(
        <tr key={i}>
          <td>{statData[i].domain}</td>
          <td className="text-center">{statData[i].tippers_count}</td>
          <td className="text-center">{statData[i].members_count}</td>
          <td className="text-center">{statData[i].tipper_percent}</td>
          <td className="text-center">{statData[i].tip_count_this_week}</td>
          <td className="text-center">{statData[i].total_tip_count}</td>
          <td className="text-center">
            {statData[i].average_tip_count_per_week}
          </td>
          <td className="text-center">{statData[i].total_comment_count}</td>
          <td className="text-center">{statData[i].total_likes_count}</td>
        </tr>
      );
    }

    return (
      <div className="statistics col-md-9 col-md-offset-1">
        <h1>
          Friyay Statistics
          <span className="small">
            &nbsp;(sorted by Tippers + 10) since our launch on March 1, 2016
          </span>
        </h1>
        <table className="table table-striped table-bordered table-condensed">
          <thead>
            <tr>
              <th>Workspace Name</th>
              <th>Card Creators +10</th>
              <th>Members</th>
              <th>Card Creator Percent</th>
              <th>Card Count This Week</th>
              <th>Total Cards</th>
              <th>Avg Card Count/Week</th>
              <th>Total Comments</th>
              <th>Total Likes</th>
            </tr>
          </thead>
          <tbody>{domainStatRows}</tbody>
        </table>
      </div>
    );
  }
});

export default GlobalStats;
