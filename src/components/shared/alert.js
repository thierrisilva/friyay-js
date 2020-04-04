import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Alert extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    errors: PropTypes.array.isRequired,
    message: PropTypes.string.isRequired
  };

  static defaultProps = {
    type: 'info',
    errors: [],
    message: ''
  };

  render() {
    const { props: { type, errors, message } } = this;

    return (
      <div className={`alert alert-${type}`}>
        <h4>{message}</h4>
        {errors.length > 0 && (
          <ul className="pl0" style={{ listStyle: 'none outside none' }}>
            {errors.map((err, i) => <li key={`error-${i}`}>{err}</li>)}
          </ul>
        )}
      </div>
    );
  }
}
