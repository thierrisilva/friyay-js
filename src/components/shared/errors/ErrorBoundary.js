import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { logRollBarError } from 'Lib/rollbar';
import ErrorMessage from './ErrorMessage';


class ErrorBoundary extends PureComponent {

  state = {
    error: false
  }

  componentDidCatch(error, info) {
    this.setState({ error: true });
    logRollBarError( error, 'critical' );
  }

  render() {
    const { props: { children }, state: { error }} = this;

    return error
      ? <ErrorMessage />
      : children
  }
}

export default ErrorBoundary;
