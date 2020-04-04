import React, { PureComponent } from 'react';
import { string, func } from 'prop-types';
import viewConfig from 'Lib/config/views/views';
import ErrorBoundary from 'Components/shared/errors/ErrorBoundary';

//watches the store for a change in header view and renders the appropriate view.  Easy
class DynamicHeaderContainer extends PureComponent {
  static propTypes = {
    headerView: string,
    addNewTopic: func
  };

  render() {
    const { headerView } = this.props;
    const HeaderViewComponent = viewConfig.headers[headerView]
      ? viewConfig.headers[headerView].viewComponent
      : viewConfig.headers['WORKSPACE_HOME'].viewComponent;

    return HeaderViewComponent ? (
      <ErrorBoundary>
        <HeaderViewComponent {...this.props} />
      </ErrorBoundary>
    ) : (
      false
    );
  }
}

export default DynamicHeaderContainer;
