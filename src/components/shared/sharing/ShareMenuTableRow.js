import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { stateMappings } from 'Src/newRedux/stateMappings';
import { getPeopleArray } from 'Src/newRedux/database/people/selectors';
import { getGroups } from 'Src/newRedux/database/groups/selectors';

class ShareMenuTableRow extends Component {

  render() {
    const { instructions, shareItems } = this.props;
    const { searchMatches } = this.state;

    return (
      <div className='share-menu'>
        <div className='share-menu_chip-container'>
          { shareItems.map( item => {
            <ShareMenuTableRowChip item={ item } onRemove={ this.handleToggleItem } />
          })}
        </div>
        <div className='share-menu_search-container'>
          <FormInput
            autoFocus
            centreText
            defaultValue={ searchString }
            onChange={ this.handleSearch }
            placeholder={ instructions } />
        </div>
        <div className='share-menu_search-results-container'>
          { searchMatches.map( match => (
            <ShareMenuTableRowTableRow shareItem={ match } onClick={ this.handleToggleItem } />
          ))}
        </div>
      </div>
    )
  }
}

const mapState = ( state, props ) => {
  const sm = stateMappings( state );
  return {
    groups: getGroups( state ),
    people: getPeopleArray( state ),
  }
}

export default connect( mapState )( ShareMenuTableRow );
