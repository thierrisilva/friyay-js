import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RightDesignSetImageDisplay extends Component {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      display: props.value
    };
  }

  handleDisplayImage = visible => {
    this.setState({
      display: visible
    });
    this.props.onChange(visible);
  };

  render() {
    return (
      <div>
        <span
          className={
            this.state.display
              ? 'Right-design-span-active'
              : 'Right-design-span'
          }
          onClick={() => this.handleDisplayImage(false)}
        >
          show
        </span>
        <span
          className={
            this.state.display
              ? 'Right-design-span'
              : 'Right-design-span-active'
          }
          onClick={() => this.handleDisplayImage(true)}
        >
          hide
        </span>
      </div>
    );
  }
}

export default RightDesignSetImageDisplay;
