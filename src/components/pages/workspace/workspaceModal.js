/* eslint-disable quotes */
import React, { Component, Fragment } from 'react';
import ReactModal from 'react-modal';
import IconButton from 'Components/shared/buttons/IconButton';
import WorkspaceWrapper from './workspaceWrapper';
import './workspace.scss';

class WorkspaceModal extends Component {
  state = {
    isModalOpen: false
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    return (
      <Fragment>
        <IconButton
          color={this.props.color}
          additionalClasses="dark-grey-icon-button"
          icon="columns"
          fontAwesome
          onClick={this.toggleModal}
          tooltip="Top View"
        />
        <ReactModal
          onRequestClose={this.toggleModal}
          isOpen={this.state.isModalOpen}
          className="modal-content"
          overlayClassName="react-modal-overlay"
        >
          <IconButton
            additionalClasses="dark-grey-icon-button close-icon"
            icon="close"
            onClick={this.toggleModal}
          />
          <WorkspaceWrapper />
        </ReactModal>
      </Fragment>
    );
  }
}

export default WorkspaceModal;
