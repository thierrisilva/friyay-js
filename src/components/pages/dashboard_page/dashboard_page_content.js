import React from 'react';
import GlobalStats from './global_stats';
import NewDomains from './new_domains';

const DashboardPageContent = ({ stats, isLoadingStats }) => (
  <div className="container-fluid">
    <div className="row">
      <NewDomains stats={stats} />
    </div>
    <div className="row">
      <GlobalStats stats={stats} isLoadingStats={isLoadingStats} />
    </div>

    {/* FUTURE USE
          <div className="row">
            <DomainStats domain={this.props.domain} />
          </div>
        */}
  </div>
);

export default DashboardPageContent;
