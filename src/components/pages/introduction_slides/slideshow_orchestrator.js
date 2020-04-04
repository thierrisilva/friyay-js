import React, { Component } from 'react';
import PropTypes from 'prop-types';

const cardStyle = {
  color: '#555',
  borderRadius: 3,
  overflow: 'hidden',
  justifyContent: 'flex-start',
  width: '100%',
  minHeight: 500
};

const btnStyle = {
  borderRadius: 3,
  minHeight: 35,
  borderColor: '#369ad6',
  color: '#369ad6',
  backgroundColor: 'white'
};

export default class SlideshowOrchestrator extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    submitBtnText: PropTypes.string,
    submitBtnClass: PropTypes.string,
    nextBtnText: PropTypes.string,
    nextBtnClass: PropTypes.string,
    nextBtnOnClick: PropTypes.func,
    children: PropTypes.array
  };

  static defaultProps = {
    nextBtnOnClick: () => {},
    onSubmit: () => {},
    submitBtnText: 'Finish',
    nextBtnText: 'Next'
  };

  state = {
    current: 0
  };

  /**
   * Get the current component to show on screen
   */
  getCurrentView = children =>
    React.Children.map(children, (child, index) =>
      React.cloneElement(child, {
        tfStyle: {
          transform: `translateX(${index * 100 - this.state.current * 200}%)`
        }
      })
    );

  /**
   * Increment State counter
   */
  incState = () => {
    if (this.props.children.length > this.state.current) {
      const current = this.state.current + 1;
      this.setState(state => ({ ...state, current }));
    }

    this.props.nextBtnOnClick();
  };

  /**
   * Check if last component
   */
  isLastComponent = () => this.props.children.length - 1 === this.state.current;

  /**
   * render the Slideshow
   */
  render() {
    let btn = (
      <button
        className="btn btn-primary"
        style={btnStyle}
        onClick={this.incState}
      >
        {this.props.nextBtnText}
        <i className="glyphicon glyphicon-triangle-right ml5" style={{fontSize: 10}} />
      </button>
    );

    if (this.isLastComponent()) {
      btn = (
        <button
          className="btn btn-primary"
          style={btnStyle}
          onClick={this.props.onSubmit}
        >
          {this.props.submitBtnText}
        </button>
      );
    }

    return (
      <div className="form-container flex-c" style={cardStyle}>
        <div style={{ display: 'flex', width: '100%' }}>
          {this.getCurrentView(this.props.children)}
        </div>
        <div className="mt10 mb10 flex-c-center">
          {btn}
          <span className="mt10">
            {this.state.current + 1} / {this.props.children.length}
          </span>
        </div>
      </div>
    );
  }
}
