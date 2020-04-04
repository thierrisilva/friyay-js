import React from 'react';
import { connect } from 'react-redux';
import { func, string } from 'prop-types';
import { setRightMenuOpenForMenu } from 'Src/newRedux/interface/menus/actions';
import IconButton from 'Components/shared/buttons/IconButton';


const SubMenuHeader = ({ rootMenu, setRightMenuOpenForMenu, title }) => (

  <div className='right-submenu_header'>
    <IconButton fontAwesome icon='caret-left' onClick={ () => setRightMenuOpenForMenu(rootMenu) } />
    <span className='ml5' >{ title }</span>
  </div>
);

SubMenuHeader.propTypes = {
  rootMenu: string.isRequired,
  setRightMenuOpenForMenu: func.isRequired,
  title: string.isRequired
}


const mapDispatch = {
  setRightMenuOpenForMenu
}

export default connect( undefined, mapDispatch )( SubMenuHeader );
