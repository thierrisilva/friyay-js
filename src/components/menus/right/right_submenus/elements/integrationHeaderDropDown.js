/* globals vex */
import React, { Component } from 'react';
import { string, func, array, oneOfType, number } from 'prop-types';
import OptionsDropdownButton from 'Components/shared/buttons/OptionsDropdownButton';

class IntegrationHeaderDropdown extends Component {

  static propTypes = {
    className: string.isRequired,
    handleClickDisconnect: func.isRequired,
    workspaceId: oneOfType([string, number]),
    setSlackPanelView: func,
    currentView: string,
    slack_workspace: array,
  }

  disconnectSlack = (workspaceId) => {
    vex.dialog.confirm({
      message: 'Disconnecting workspace will delete all connections data, proceed ?',
      callback: (value) => value && this.props.handleClickDisconnect(workspaceId)
    });
  }


  handleClick = (option) => {
    if (option == 'Disconnect') {
      this.disconnectSlack(this.props.workspaceId);
    } else {
      const optionMap = {
        'Connect New': 'connect',
        'Workspaces': 'workspaces',
      }[option];

      this.props.setSlackPanelView(optionMap);
    }
  };

  render() {
    const { className, workspaceId, currentView, slack_workspace } = this.props;
    const adminOptions = (workspaceId !== 'select' && currentView !== 'connect')
      ? ['Disconnect', 'Connect New'] : currentView === 'connect' && slack_workspace.length > 0
        ? ['Workspaces'] : ['Connect New'];

    return(
      <OptionsDropdownButton className={className}>
        { adminOptions.map(option => (
          <a className='dropdown-option-item' key={option} onClick={() => this.handleClick(option)}>
            {option}
          </a>
        ))}
      </OptionsDropdownButton>
    );
  }
}

export default IntegrationHeaderDropdown;
