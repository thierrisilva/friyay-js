import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { func, object, string } from 'prop-types';
import Icon from 'Components/shared/Icon';

import SelectableUserList from './SelectableUserList';
import UserAvatar from './UserAvatar';

class UserSelect extends PureComponent {

  state = { showDropdown: false }

  static propTypes = {
    className: string,
    selectedUser: object,
    onSelectUser: func.isRequired
  }


  handleClickEvent = (e) => {
    ( this.dropdownRef && !this.dropdownRef.contains(e.target)) && this.handleToggleDropdown();
  }


  handleSelectUser = ([ userId ]) => {
    this.props.onSelectUser( userId );
    this.handleToggleDropdown();
  }


  handleToggleDropdown = () => {
    const { showDropdown } = this.state;
    this.setState({ showDropdown: !showDropdown });
    showDropdown
      ? document.removeEventListener('click', this.handleClickEvent, true)
      : document.addEventListener('click', this.handleClickEvent, true);
  }


  saveDropdownRef = ref => {
    this.dropdownRef = ref;
  };


  render() {
    const { className = '', selectedUser, showAvatar, showName } = this.props;
    const { showDropdown } = this.state;

    return(
      <div className={`dropdown label-select ${ showDropdown && 'open'} ${className}`}  ref={this.saveDropdownRef}>
          <a
            onClick={ this.handleToggleDropdown }
            className="dropdown label-select"
            role="button"
            aria-haspopup="true"
            aria-expanded="false" >
            { showAvatar ? (
              <span className='relative'>
                <UserAvatar showName={ showName } userId={ selectedUser ? selectedUser.id : null } />
                <Icon containerClasses='user-select_caret-over-avatar' fontAwesome icon='caret-down' />
              </span>
            ) : (
              <Fragment>
                <span className='label-select_name'>{ selectedUser ? selectedUser.attributes.name : 'Select user' }</span>
                <Icon fontAwesome icon='caret-down' />
              </Fragment>
            ) }
          </a>
          <div
            className={`dropdown-menu label-select-dropdown assigned-user-list ${ showDropdown && 'open'}`}
            aria-labelledby="dLabel" >

            <SelectableUserList
              onChangeSelection={ this.handleSelectUser }
              selectedUserIds={ selectedUser ? [ selectedUser.id ] : [] }/>
          </div>
      </div>
    );
  }
}

export default UserSelect;
