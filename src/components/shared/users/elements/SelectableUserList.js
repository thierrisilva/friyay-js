import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getPeopleArray } from 'Src/newRedux/database/people/selectors';
import { toggleItemInclusionInArray } from 'Lib/utilities';

import UserAvatar from './UserAvatar';

class SelectableUserList extends PureComponent {

  handleToggleUserSelected = ( person ) => {
    const { multiSelect, onChangeSelection, selectedUserIds } = this.props;
    const revisedSelectedUsers = toggleItemInclusionInArray( person.id, selectedUserIds );
    multiSelect
      ? onChangeSelection( revisedSelectedUsers )
      : onChangeSelection([ person.id ]);
  }

  render() {
    const { people, selectedUserIds } = this.props;

    return(
      <div className='selectable-user-list'>
        { people.map( person  => (
          <a className='selectable-user-list_row' key={ person.id } onClick={ () => this.handleToggleUserSelected( person )}>
            <UserAvatar showName userId={ person.id } />
          </a>
        ))}
      </div>
    )
  }
}

const mapState = ( state, props ) => ({
  people: getPeopleArray( state )
})

export default connect( mapState )( SelectableUserList );
