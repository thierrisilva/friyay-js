import React, { PureComponent } from 'react';
import ModalContainer from './ModalContainer';


class RightModal extends PureComponent {

  state = {
    isPresented: false
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({ isPresented: true })
    })
  }

  render() {
    return (
      <ModalContainer>
        <div className={`modal-container_right ${ this.state.isPresented && 'presented' }`}>
          { this.props.children }
        </div>
      </ModalContainer>
    )
  }
}

export default RightModal;
