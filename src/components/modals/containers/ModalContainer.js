import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';


class ModalContainer extends PureComponent {

  state = {
    isPresented: false
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({ isPresented: true })
    })
  }

  render() {
    const appRoot = document.getElementById('app-container');

    return ReactDOM.createPortal(
      <div className={`modal-container ${ this.state.isPresented && 'presented' }`}>
        { this.props.children }
      </div>,
      appRoot
    )

  }
}

export default ModalContainer;
