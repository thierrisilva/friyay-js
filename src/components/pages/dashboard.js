import React from 'react';
import DashboardActions from '../../actions/dashboard_actions';
import DashboardStore from '../../stores/dashboard_store';
import PageContainer from './page_container';
import DashboardPageContent from './dashboard_page/dashboard_page_content';
import createClass from 'create-react-class';

var Dashboard = createClass({
  getInitialState: function() {
    return {
      stats: null,
      isLoadingStats: true
    };
  },

  componentDidMount: function() {
    DashboardStore.addEventListener(window.DASHBOARD_LOAD_EVENT, this.onDashboardDataLoad);

    DashboardActions.loadStats();
  },

  componentWillUnmount: function() {
    DashboardStore.removeEventListener(window.DASHBOARD_LOAD_EVENT, this.onDashboardDataLoad);
  },

  onDashboardDataLoad: function(responseData) {
    this.setState({
      stats: responseData,
      isLoadingStats: false
    });
  },

  render: function() {
    var stats = this.state.stats;

    var isLoadingStats = this.state.isLoadingStats;

    var dashboardContent;
    if (stats) {
      dashboardContent =
        <DashboardPageContent history={this.props.router} location={this.props.location}
                              stats={stats} isLoadingStats={isLoadingStats} />;
    } else {
      dashboardContent = <div className="text-center"><img src="/images/ajax-loader.gif" /></div>;
    }


    return (
      <PageContainer stats={stats} history={this.props.router} location={this.props.location} params={this.props.params}>
        {dashboardContent}
      </PageContainer>
    );
  }
});

export default Dashboard;
